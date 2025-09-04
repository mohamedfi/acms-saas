<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RentalCompany;
use App\Models\PotentialClient;
use App\Models\CompanyVehicle;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BusinessClientsReportController extends Controller
{
    /**
     * Display business clients reports
     */
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);
        $endDate = Carbon::now();

        // Get comprehensive statistics
        $stats = $this->getBusinessStats($startDate, $endDate);

        // Get chart data
        $chartData = $this->getBusinessChartData($startDate, $endDate);

        // Get geographic distribution
        $geographicData = $this->getGeographicData();

        // Get performance metrics
        $performanceData = $this->getBusinessPerformanceMetrics($startDate, $endDate);

        // Get recent activities
        $recentActivities = $this->getBusinessRecentActivities($startDate, $endDate);

        return Inertia::render('Reports/BusinessClients', [
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
     * Get business clients statistics
     */
    private function getBusinessStats($startDate, $endDate)
    {
        // Total counts
        $totalCompanies = RentalCompany::count();
        $totalPotentialClients = PotentialClient::count();
        $totalBusinessClients = $totalCompanies + $totalPotentialClients;

        // Active counts
        $activeCompanies = RentalCompany::where('is_active', true)->count();
        $activePotentialClients = PotentialClient::whereIn('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating'])->count();
        $activeBusinessClients = $activeCompanies + $activePotentialClients;

        // New this period
        $newCompanies = RentalCompany::where('created_at', '>=', $startDate)->count();
        $newPotentialClients = PotentialClient::where('created_at', '>=', $startDate)->count();
        $newBusinessClients = $newCompanies + $newPotentialClients;

        // Revenue data
        $totalRevenue = RentalCompany::with('vehicles')->get()->sum(function ($company) {
            return $company->vehicles->sum('revenue_to_date');
        });

        $newRevenue = RentalCompany::with('vehicles')
            ->where('created_at', '>=', $startDate)
            ->get()
            ->sum(function ($company) {
                return $company->vehicles->sum('revenue_to_date');
            });

        // Vehicle metrics
        $totalVehicles = CompanyVehicle::count();
        $activeVehicles = CompanyVehicle::where('status', 'active')->count();

        // Growth rates
        $previousPeriodStart = $startDate->copy()->subDays($endDate->diffInDays($startDate));
        $previousPeriodNew = RentalCompany::whereBetween('created_at', [$previousPeriodStart, $startDate])->count() +
            PotentialClient::whereBetween('created_at', [$previousPeriodStart, $startDate])->count();

        $growthRate = $previousPeriodNew > 0 ? (($newBusinessClients - $previousPeriodNew) / $previousPeriodNew) * 100 : 0;

        return [
            'total_business_clients' => $totalBusinessClients,
            'active_business_clients' => $activeBusinessClients,
            'new_business_clients' => $newBusinessClients,
            'total_revenue' => $totalRevenue,
            'new_revenue' => $newRevenue,
            'total_vehicles' => $totalVehicles,
            'active_vehicles' => $activeVehicles,
            'growth_rate' => round($growthRate, 2),
            'companies' => [
                'total' => $totalCompanies,
                'active' => $activeCompanies,
                'new' => $newCompanies,
            ],
            'potential_clients' => [
                'total' => $totalPotentialClients,
                'active' => $activePotentialClients,
                'new' => $newPotentialClients,
            ],
        ];
    }

    /**
     * Get business chart data
     */
    private function getBusinessChartData($startDate, $endDate)
    {
        // Client type distribution
        $typeDistribution = [
            'companies' => RentalCompany::count(),
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
                'companies' => RentalCompany::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'potential_clients' => PotentialClient::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        // Status distribution
        $statusDistribution = [
            'active' => RentalCompany::where('is_active', true)->count() +
                PotentialClient::whereIn('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating'])->count(),
            'inactive' => RentalCompany::where('is_active', false)->count() +
                PotentialClient::whereIn('status', ['closed_lost'])->count(),
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
        // Countries from companies
        $companyCountries = RentalCompany::select('country', DB::raw('count(*) as count'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->get();

        // Countries from potential clients
        $potentialClientCountries = PotentialClient::select('country', DB::raw('count(*) as count'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->get();

        // Combine and merge data
        $allCountries = collect();

        // Add company countries
        foreach ($companyCountries as $item) {
            $allCountries->put($item->country, [
                'country' => $item->country,
                'companies' => $item->count,
                'potential_clients' => 0,
                'total' => $item->count,
            ]);
        }

        // Add potential client countries
        foreach ($potentialClientCountries as $item) {
            if ($allCountries->has($item->country)) {
                $allCountries[$item->country]['potential_clients'] = $item->count;
                $allCountries[$item->country]['total'] += $item->count;
            } else {
                $allCountries->put($item->country, [
                    'country' => $item->country,
                    'companies' => 0,
                    'potential_clients' => $item->count,
                    'total' => $item->count,
                ]);
            }
        }

        return $allCountries->sortByDesc('total')->take(15)->values();
    }

    /**
     * Get business performance metrics
     */
    private function getBusinessPerformanceMetrics($startDate, $endDate)
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
            'total_vehicles' => CompanyVehicle::count(),
            'active_vehicles' => CompanyVehicle::where('status', 'active')->count(),
            'avg_rating' => RentalCompany::avg('rating'),
            'conversion_rate' => $this->calculateConversionRate(),
        ];

        return [
            'topCompanies' => $topCompanies,
            'topPotentialClients' => $topPotentialClients,
            'systemMetrics' => $systemMetrics,
        ];
    }

    /**
     * Get recent business activities
     */
    private function getBusinessRecentActivities($startDate, $endDate)
    {
        $activities = collect();

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

        // Recent potential clients
        $recentPotentialClients = PotentialClient::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentPotentialClients as $client) {
            $activities->push([
                'type' => 'potential_client_created',
                'message' => "New business lead: {$client->name}",
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
