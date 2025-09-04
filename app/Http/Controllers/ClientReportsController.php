<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Participant;
use App\Models\RentalCompany;
use App\Models\CompanyVehicle;
use App\Models\PotentialClient;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClientReportsController extends Controller
{
    /**
     * Display comprehensive client reports
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);
        $endDate = Carbon::now();

        // Get comprehensive statistics
        $stats = $this->getComprehensiveStats($startDate, $endDate);

        // Get chart data
        $chartData = $this->getChartData($startDate, $endDate);

        // Get geographic distribution
        $geographicData = $this->getGeographicData();

        // Get performance metrics
        $performanceData = $this->getPerformanceMetrics($startDate, $endDate);

        // Get recent activities
        $recentActivities = $this->getRecentActivities($startDate, $endDate);

        return Inertia::render('Clients/Reports', [
            'stats' => $stats,
            'chartData' => $chartData,
            'geographicData' => $geographicData,
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
     * Export reports as PDF
     */
    public function exportPdf(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = Carbon::now()->subDays($period);
        $endDate = Carbon::now();

        // Get all data for PDF
        $stats = $this->getComprehensiveStats($startDate, $endDate);
        $chartData = $this->getChartData($startDate, $endDate);
        $geographicData = $this->getGeographicData();
        $performanceData = $this->getPerformanceMetrics($startDate, $endDate);
        $recentActivities = $this->getRecentActivities($startDate, $endDate);

        // Generate PDF content
        $html = $this->generatePdfHtml($stats, $chartData, $geographicData, $performanceData, $recentActivities, $startDate, $endDate);

        // Return HTML for client-side PDF generation
        return response()->json([
            'html' => $html,
            'filename' => 'client_reports_' . date('Y-m-d_H-i-s') . '.pdf'
        ]);
    }

    /**
     * Get comprehensive statistics
     */
    private function getComprehensiveStats($startDate, $endDate)
    {
        // Total counts
        $totalParticipants = Participant::count();
        $totalCompanies = RentalCompany::count();
        $totalUsers = User::count();
        $totalPotentialClients = PotentialClient::count();
        $totalClients = $totalParticipants + $totalCompanies + $totalUsers + $totalPotentialClients;

        // Active counts
        $activeParticipants = Participant::count(); // All participants are considered active
        $activeCompanies = RentalCompany::where('is_active', true)->count();
        $activeUsers = User::where('is_active', true)->count();
        $activeClients = $activeParticipants + $activeCompanies + $activeUsers;

        // New this period
        $newParticipants = Participant::where('created_at', '>=', $startDate)->count();
        $newCompanies = RentalCompany::where('created_at', '>=', $startDate)->count();
        $newUsers = User::where('created_at', '>=', $startDate)->count();
        $newClients = $newParticipants + $newCompanies + $newUsers;

        // Revenue data
        $totalRevenue = RentalCompany::with('vehicles')->get()->sum(function ($company) {
            return $company->vehicles->sum('revenue_to_date');
        });

        // Growth rates
        $previousPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate));
        $previousPeriodNew = Participant::whereBetween('created_at', [$previousPeriodStart, $startDate])->count() +
            RentalCompany::whereBetween('created_at', [$previousPeriodStart, $startDate])->count() +
            User::whereBetween('created_at', [$previousPeriodStart, $startDate])->count();

        $growthRate = $previousPeriodNew > 0 ? (($newClients - $previousPeriodNew) / $previousPeriodNew) * 100 : 0;

        return [
            'total_clients' => $totalClients,
            'active_clients' => $activeClients,
            'new_clients' => $newClients,
            'total_revenue' => $totalRevenue,
            'growth_rate' => round($growthRate, 2),
            'participants' => [
                'total' => $totalParticipants,
                'active' => $activeParticipants,
                'new' => $newParticipants,
            ],
            'companies' => [
                'total' => $totalCompanies,
                'active' => $activeCompanies,
                'new' => $newCompanies,
            ],
            'users' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'new' => $newUsers,
            ],
        ];
    }

    /**
     * Get chart data for various visualizations
     */
    private function getChartData($startDate, $endDate)
    {
        // Client type distribution
        $typeDistribution = [
            'participants' => Participant::count(),
            'companies' => RentalCompany::count(),
            'users' => User::count(),
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
                'companies' => RentalCompany::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'users' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        // Status distribution
        $statusDistribution = [
            'active' => Participant::count() + // All participants are considered active
                RentalCompany::where('is_active', true)->count() +
                User::where('is_active', true)->count(),
            'inactive' => RentalCompany::where('is_active', false)->count() +
                User::where('is_active', false)->count(),
        ];

        // Revenue by company (top 10)
        $revenueByCompany = RentalCompany::with('vehicles')
            ->get()
            ->map(function ($company) {
                return [
                    'name' => $company->name,
                    'revenue' => $company->vehicles->sum('revenue_to_date'),
                    'vehicles' => $company->vehicles->count(),
                ];
            })
            ->sortByDesc('revenue')
            ->take(10)
            ->values();

        return [
            'typeDistribution' => $typeDistribution,
            'monthlyGrowth' => $monthlyGrowth,
            'statusDistribution' => $statusDistribution,
            'revenueByCompany' => $revenueByCompany,
        ];
    }

    /**
     * Get geographic distribution data
     */
    private function getGeographicData()
    {
        // Countries from companies only (participants don't have country column)
        $companyCountries = RentalCompany::select('country', DB::raw('count(*) as count'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->get();

        // Convert to the expected format
        $allCountries = collect();

        foreach ($companyCountries as $item) {
            $allCountries->put($item->country, [
                'country' => $item->country,
                'participants' => 0, // No country data for participants
                'companies' => $item->count,
                'total' => $item->count,
            ]);
        }

        return $allCountries->sortByDesc('total')->take(15)->values();
    }

    /**
     * Get performance metrics
     */
    private function getPerformanceMetrics($startDate, $endDate)
    {
        // Top performing companies by revenue
        $topCompanies = RentalCompany::with('vehicles')
            ->get()
            ->map(function ($company) {
                return [
                    'name' => $company->name,
                    'revenue' => $company->vehicles->sum('revenue_to_date'),
                    'vehicles' => $company->vehicles->count(),
                    'rating' => $company->rating,
                    'is_verified' => $company->is_verified,
                    'is_featured' => $company->is_featured,
                ];
            })
            ->sortByDesc('revenue')
            ->take(10);

        // Most active participants (by course enrollments)
        $activeParticipants = Participant::with('courses')
            ->get()
            ->map(function ($participant) {
                return [
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'courses_count' => $participant->courses->count(),
                    'company' => $participant->company,
                    'status' => $participant->status,
                ];
            })
            ->sortByDesc('courses_count')
            ->take(10);

        // System usage metrics
        $systemMetrics = [
            'total_vehicles' => CompanyVehicle::count(),
            'active_vehicles' => CompanyVehicle::where('status', 'active')->count(),
            'total_courses' => DB::table('course_enrollments')->count(),
            'avg_rating' => RentalCompany::avg('rating'),
        ];

        return [
            'topCompanies' => $topCompanies,
            'activeParticipants' => $activeParticipants,
            'systemMetrics' => $systemMetrics,
        ];
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($startDate, $endDate)
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
                'message' => "New participant registered: {$participant->name}",
                'time' => $participant->created_at,
                'client_type' => 'participant',
                'client_id' => $participant->id,
                'icon' => '👥',
                'color' => 'blue',
            ]);
        }

        // Recent companies
        $recentCompanies = RentalCompany::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentCompanies as $company) {
            $activities->push([
                'type' => 'company_created',
                'message' => "New rental company registered: {$company->name}",
                'time' => $company->created_at,
                'client_type' => 'company',
                'client_id' => $company->id,
                'icon' => '🏢',
                'color' => 'green',
            ]);
        }

        return $activities->sortByDesc('time')->take(10)->values();
    }

    /**
     * Generate HTML content for PDF export
     */
    private function generatePdfHtml($stats, $chartData, $geographicData, $performanceData, $recentActivities, $startDate, $endDate)
    {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Client Reports - ' . date('Y-m-d') . '</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
                .header h1 { color: #007bff; margin: 0; }
                .header p { color: #666; margin: 5px 0; }
                .section { margin-bottom: 30px; }
                .section h2 { color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
                .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
                .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
                .stat-label { color: #666; margin-top: 5px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                .table th { background-color: #f8f9fa; font-weight: bold; }
                .table tr:nth-child(even) { background-color: #f8f9fa; }
                .chart-placeholder { background: #f8f9fa; padding: 40px; text-align: center; border: 2px dashed #ddd; margin: 20px 0; }
                .activity-item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
                .activity-icon { font-size: 1.5em; margin-right: 15px; }
                .activity-content { flex: 1; }
                .activity-time { color: #666; font-size: 0.9em; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.9em; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Client Management Reports</h1>
                <p>Generated on ' . date('F j, Y \a\t g:i A') . '</p>
                <p>Report Period: ' . $startDate->format('M j, Y') . ' - ' . $endDate->format('M j, Y') . '</p>
            </div>

            <div class="section">
                <h2>📈 Key Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">' . number_format($stats['total_clients']) . '</div>
                        <div class="stat-label">Total Clients</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">' . number_format($stats['active_clients']) . '</div>
                        <div class="stat-label">Active Clients</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">' . number_format($stats['new_clients']) . '</div>
                        <div class="stat-label">New This Period</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">$' . number_format($stats['total_revenue']) . '</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">' . $stats['growth_rate'] . '%</div>
                        <div class="stat-label">Growth Rate</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>👥 Client Type Distribution</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Client Type</th>
                            <th>Total</th>
                            <th>Active</th>
                            <th>New This Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>👥 Training Participants</td>
                            <td>' . number_format($stats['participants']['total']) . '</td>
                            <td>' . number_format($stats['participants']['active']) . '</td>
                            <td>' . number_format($stats['participants']['new']) . '</td>
                        </tr>
                        <tr>
                            <td>🏢 Rental Companies</td>
                            <td>' . number_format($stats['companies']['total']) . '</td>
                            <td>' . number_format($stats['companies']['active']) . '</td>
                            <td>' . number_format($stats['companies']['new']) . '</td>
                        </tr>
                        <tr>
                            <td>👤 System Users</td>
                            <td>' . number_format($stats['users']['total']) . '</td>
                            <td>' . number_format($stats['users']['active']) . '</td>
                            <td>' . number_format($stats['users']['new']) . '</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>🌍 Geographic Distribution</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Participants</th>
                            <th>Companies</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>';

        foreach ($geographicData as $country) {
            $html .= '
                        <tr>
                            <td>' . $country['country'] . '</td>
                            <td>' . $country['participants'] . '</td>
                            <td>' . $country['companies'] . '</td>
                            <td>' . $country['total'] . '</td>
                        </tr>';
        }

        $html .= '
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>🏆 Top Performing Companies</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Revenue</th>
                            <th>Vehicles</th>
                            <th>Rating</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>';

        foreach ($performanceData['topCompanies'] as $company) {
            $status = '';
            if ($company['is_featured']) $status .= '⭐ Featured ';
            if ($company['is_verified']) $status .= '✅ Verified';
            if (empty($status)) $status = 'Standard';

            $html .= '
                        <tr>
                            <td>' . $company['name'] . '</td>
                            <td>$' . number_format($company['revenue']) . '</td>
                            <td>' . $company['vehicles'] . '</td>
                            <td>' . $company['rating'] . '/5</td>
                            <td>' . $status . '</td>
                        </tr>';
        }

        $html .= '
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>📈 Recent Activities</h2>';

        foreach ($recentActivities as $activity) {
            $html .= '
                <div class="activity-item">
                    <div class="activity-icon">' . $activity['icon'] . '</div>
                    <div class="activity-content">
                        <div>' . $activity['message'] . '</div>
                        <div class="activity-time">' . $activity['time']->format('M j, Y \a\t g:i A') . '</div>
                    </div>
                </div>';
        }

        $html .= '
            </div>

            <div class="footer">
                <p>This report was generated automatically by the ACMS-SaaS Client Management System.</p>
                <p>For questions or support, please contact your system administrator.</p>
            </div>
        </body>
        </html>';

        return $html;
    }
}
