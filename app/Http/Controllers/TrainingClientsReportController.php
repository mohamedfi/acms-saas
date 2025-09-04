<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Participant;
use App\Models\PotentialClient;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TrainingClientsReportController extends Controller
{
    /**
     * Display training clients reports
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);
        $endDate = Carbon::now();

        // Get comprehensive statistics
        $stats = $this->getTrainingStats($startDate, $endDate);

        // Get chart data
        $chartData = $this->getTrainingChartData($startDate, $endDate);

        // Get performance metrics
        $performanceData = $this->getTrainingPerformanceMetrics($startDate, $endDate);

        // Get recent activities
        $recentActivities = $this->getTrainingRecentActivities($startDate, $endDate);

        return Inertia::render('Reports/TrainingClients', [
            'stats' => $stats,
            'chartData' => $chartData,
            'performanceData' => $performanceData,
            'recentActivities' => $recentActivities,
            'period' => $period,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Get training clients statistics
     */
    private function getTrainingStats($startDate, $endDate)
    {
        // Total counts
        $totalParticipants = Participant::count();
        $totalPotentialClients = PotentialClient::count();
        $totalTrainingClients = $totalParticipants + $totalPotentialClients;

        // Active counts
        $activeParticipants = Participant::count(); // All participants are considered active
        $activePotentialClients = PotentialClient::whereIn('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating'])->count();
        $activeTrainingClients = $activeParticipants + $activePotentialClients;

        // New this period
        $newParticipants = Participant::where('created_at', '>=', $startDate)->count();
        $newPotentialClients = PotentialClient::where('created_at', '>=', $startDate)->count();
        $newTrainingClients = $newParticipants + $newPotentialClients;

        // Course enrollments
        $totalEnrollments = DB::table('course_enrollments')->count();
        $newEnrollments = DB::table('course_enrollments')->where('created_at', '>=', $startDate)->count();

        // Growth rates
        $previousPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate));
        $previousPeriodNew = Participant::whereBetween('created_at', [$previousPeriodStart, $startDate])->count() +
            PotentialClient::whereBetween('created_at', [$previousPeriodStart, $startDate])->count();

        $growthRate = $previousPeriodNew > 0 ? (($newTrainingClients - $previousPeriodNew) / $previousPeriodNew) * 100 : 0;

        return [
            'total_training_clients' => $totalTrainingClients,
            'active_training_clients' => $activeTrainingClients,
            'new_training_clients' => $newTrainingClients,
            'total_enrollments' => $totalEnrollments,
            'new_enrollments' => $newEnrollments,
            'growth_rate' => round($growthRate, 2),
            'participants' => [
                'total' => $totalParticipants,
                'active' => $activeParticipants,
                'new' => $newParticipants,
            ],
            'potential_clients' => [
                'total' => $totalPotentialClients,
                'active' => $activePotentialClients,
                'new' => $newPotentialClients,
            ],
        ];
    }

    /**
     * Get training chart data
     */
    private function getTrainingChartData($startDate, $endDate)
    {
        // Client type distribution
        $typeDistribution = [
            'participants' => Participant::count(),
            'potential_clients' => PotentialClient::count(),
        ];

        // Monthly growth data (last 12 months)
        $monthlyGrowth = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyGrowth[] = [
                'month' => $month->format('M Y'),
                'participants' => Participant::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'potential_clients' => PotentialClient::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        // Potential client status distribution
        $statusDistribution = [
            'new' => PotentialClient::where('status', 'new')->count(),
            'contacted' => PotentialClient::where('status', 'contacted')->count(),
            'qualified' => PotentialClient::where('status', 'qualified')->count(),
            'proposal_sent' => PotentialClient::where('status', 'proposal_sent')->count(),
            'negotiating' => PotentialClient::where('status', 'negotiating')->count(),
            'closed_won' => PotentialClient::where('status', 'closed_won')->count(),
            'closed_lost' => PotentialClient::where('status', 'closed_lost')->count(),
        ];

        return [
            'typeDistribution' => $typeDistribution,
            'monthlyGrowth' => $monthlyGrowth,
            'statusDistribution' => $statusDistribution,
        ];
    }

    /**
     * Get training performance metrics
     */
    private function getTrainingPerformanceMetrics($startDate, $endDate)
    {
        // Most active participants (by course enrollments)
        $activeParticipants = Participant::with('courses')
            ->get()
            ->map(function ($participant) {
                return [
                    'name' => $participant->full_name,
                    'email' => $participant->email,
                    'courses_count' => $participant->courses->count(),
                    'organization' => $participant->organization,
                ];
            })
            ->sortByDesc('courses_count')
            ->take(10);

        // Top potential clients by estimated value
        $topPotentialClients = PotentialClient::orderBy('estimated_value', 'desc')
            ->take(10)
            ->get()
            ->map(function ($client) {
                return [
                    'name' => $client->name,
                    'company' => $client->company,
                    'estimated_value' => $client->estimated_value,
                    'status' => $client->status,
                    'source' => $client->source,
                ];
            });

        // System metrics
        $systemMetrics = [
            'total_courses' => DB::table('course_enrollments')->count(),
            'avg_estimated_value' => PotentialClient::avg('estimated_value'),
            'conversion_rate' => $this->calculateConversionRate(),
        ];

        return [
            'activeParticipants' => $activeParticipants,
            'topPotentialClients' => $topPotentialClients,
            'systemMetrics' => $systemMetrics,
        ];
    }

    /**
     * Get recent training activities
     */
    private function getTrainingRecentActivities($startDate, $endDate)
    {
        $activities = collect();

        // Recent participants
        $recentParticipants = Participant::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentParticipants as $participant) {
            $activities->push([
                'type' => 'participant_created',
                'message' => "New training participant registered: {$participant->full_name}",
                'time' => $participant->created_at,
                'client_type' => 'participant',
                'client_id' => $participant->id,
                'icon' => '🎯',
                'color' => 'blue',
            ]);
        }

        // Recent potential clients
        $recentPotentialClients = PotentialClient::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentPotentialClients as $client) {
            $activities->push([
                'type' => 'potential_client_created',
                'message' => "New training lead: {$client->name}",
                'time' => $client->created_at,
                'client_type' => 'potential_client',
                'client_id' => $client->id,
                'icon' => '💡',
                'color' => 'yellow',
            ]);
        }

        return $activities->sortByDesc('time')->take(10)->values();
    }

    /**
     * Calculate conversion rate from potential to actual clients
     */
    private function calculateConversionRate()
    {
        $totalPotential = PotentialClient::count();
        $converted = PotentialClient::where('status', 'closed_won')->count();

        return $totalPotential > 0 ? round(($converted / $totalPotential) * 100, 2) : 0;
    }
}
