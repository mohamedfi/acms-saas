<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SystemUsersReportController extends Controller
{
    /**
     * Display system users reports
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);
        $endDate = Carbon::now();

        // Get comprehensive statistics
        $stats = $this->getSystemUserStats($startDate, $endDate);

        // Get chart data
        $chartData = $this->getSystemUserChartData($startDate, $endDate);

        // Get performance metrics
        $performanceData = $this->getSystemUserPerformanceMetrics($startDate, $endDate);

        // Get recent activities
        $recentActivities = $this->getSystemUserRecentActivities($startDate, $endDate);

        return Inertia::render('Reports/SystemUsers', [
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
     * Get system users statistics
     */
    private function getSystemUserStats($startDate, $endDate)
    {
        // Total counts
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        // New this period
        $newUsers = User::where('created_at', '>=', $startDate)->count();

        // User roles distribution
        $roleDistribution = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get()
            ->pluck('count', 'role')
            ->toArray();

        // Growth rates
        $previousPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate));
        $previousPeriodNew = User::whereBetween('created_at', [$previousPeriodStart, $startDate])->count();

        $growthRate = $previousPeriodNew > 0 ? (($newUsers - $previousPeriodNew) / $previousPeriodNew) * 100 : 0;

        return [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'inactive_users' => $inactiveUsers,
            'new_users' => $newUsers,
            'growth_rate' => round($growthRate, 2),
            'role_distribution' => $roleDistribution,
        ];
    }

    /**
     * Get system user chart data
     */
    private function getSystemUserChartData($startDate, $endDate)
    {
        // User status distribution
        $statusDistribution = [
            'active' => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
        ];

        // Monthly growth data (last 12 months)
        $monthlyGrowth = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyGrowth[] = [
                'month' => $month->format('M Y'),
                'users' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        // Role distribution
        $roleDistribution = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get()
            ->map(function ($item) {
                return [
                    'role' => $item->role ?: 'No Role',
                    'count' => $item->count,
                ];
            });

        return [
            'statusDistribution' => $statusDistribution,
            'monthlyGrowth' => $monthlyGrowth,
            'roleDistribution' => $roleDistribution,
        ];
    }

    /**
     * Get system user performance metrics
     */
    private function getSystemUserPerformanceMetrics($startDate, $endDate)
    {
        // Most recent users
        $recentUsers = User::orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?: 'No Role',
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at,
                    'last_login' => $user->last_login_at,
                ];
            });

        // System metrics
        $systemMetrics = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'regular_users' => User::where('role', 'user')->count(),
            'avg_users_per_month' => $this->calculateAverageUsersPerMonth(),
        ];

        return [
            'recentUsers' => $recentUsers,
            'systemMetrics' => $systemMetrics,
        ];
    }

    /**
     * Get recent system user activities
     */
    private function getSystemUserRecentActivities($startDate, $endDate)
    {
        $activities = collect();

        // Recent user registrations
        $recentUsers = User::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        foreach ($recentUsers as $user) {
            $activities->push([
                'type' => 'user_created',
                'message' => "New system user registered: {$user->name}",
                'time' => $user->created_at,
                'user_type' => 'system_user',
                'user_id' => $user->id,
                'icon' => '👨‍💼',
                'color' => 'blue',
            ]);
        }

        return $activities->sortByDesc('time')->take(10)->values();
    }

    /**
     * Calculate average users per month
     */
    private function calculateAverageUsersPerMonth()
    {
        $months = 12;
        $totalUsers = User::where('created_at', '>=', Carbon::now()->subMonths($months))->count();

        return $months > 0 ? round($totalUsers / $months, 2) : 0;
    }
}
