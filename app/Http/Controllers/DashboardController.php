<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Participant;
use App\Models\Task;
use App\Models\CourseInstance;
use App\Models\MealBreakPlan;
use App\Models\MealBreakPlanItem;
use App\Models\Employee;
use App\Models\Asset;
use App\Models\Budget;
use App\Models\ArchivedCourse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        // Get real-time statistics from the database
        $stats = $this->getDashboardStats();

        // Get recent data for display
        $recentData = $this->getRecentData();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentData' => $recentData,
        ]);
    }

    /**
     * Get comprehensive dashboard statistics
     */
    private function getDashboardStats()
    {
        try {
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
            $lastMonth = Carbon::now()->subMonth()->startOfMonth();

            return [
                // Course Statistics
                'totalCourses' => Course::count(),
                'activeCourses' => CourseInstance::whereIn('status', ['scheduled', 'in_progress'])->count(),
                'completedCourses' => CourseInstance::where('status', 'completed')->count(),
                'upcomingCourses' => CourseInstance::where('start_date', '>=', $today)->where('status', 'scheduled')->count(),
                'archivedCourses' => ArchivedCourse::count(),

                // Participant Statistics
                'totalParticipants' => Participant::count(),
                'activeParticipants' => Participant::count(), // All participants are considered active
                'newParticipantsThisMonth' => Participant::where('created_at', '>=', $thisMonth)->count(),

                // Task Statistics
                'totalTasks' => Task::count(),
                'pendingTasks' => Task::whereIn('status', ['pending', 'in_progress'])->count(),
                'completedTasks' => Task::where('status', 'completed')->count(),
                'overdueTasks' => Task::where('due_date', '<', $today)->whereNotIn('status', ['completed', 'cancelled'])->count(),

                // Employee Statistics
                'totalEmployees' => Employee::count(),
                'activeEmployees' => Employee::where('is_active', true)->count(),
                'trainers' => Employee::whereHas('role', function ($query) {
                    $query->where('name', 'trainer');
                })->count(),
                'coordinators' => Employee::whereHas('role', function ($query) {
                    $query->where('name', 'coordinator');
                })->count(),

                // Asset Statistics
                'totalAssets' => Asset::count(),
                'availableAssets' => Asset::where('status', 'available')->count(),
                'inUseAssets' => Asset::where('status', 'in_use')->count(),
                'maintenanceAssets' => Asset::where('status', 'maintenance')->count(),

                // Financial Statistics
                'totalBudget' => Budget::sum('budgeted_amount'),
                'usedBudget' => Budget::sum('actual_amount'),
                'availableBudget' => Budget::sum('budgeted_amount') - Budget::sum('actual_amount'),

                // Meal Plan Statistics
                'totalMealPlans' => MealBreakPlan::count(),
                'activeMealPlans' => MealBreakPlan::whereIn('status', ['draft', 'active'])->count(),
                'totalMeals' => MealBreakPlanItem::count(),
                'totalMealCost' => MealBreakPlanItem::sum('total'),

                // Monthly Trends
                'coursesThisMonth' => CourseInstance::where('created_at', '>=', $thisMonth)->count(),
                'participantsThisMonth' => Participant::where('created_at', '>=', $thisMonth)->count(),
                'tasksThisMonth' => Task::where('created_at', '>=', $thisMonth)->count(),

                // Last Month Comparison
                'coursesLastMonth' => CourseInstance::whereBetween('created_at', [$lastMonth, $thisMonth])->count(),
                'participantsLastMonth' => Participant::whereBetween('created_at', [$lastMonth, $thisMonth])->count(),
                'tasksLastMonth' => Task::whereBetween('created_at', [$lastMonth, $thisMonth])->count(),
            ];
        } catch (\Exception $e) {
            // Log the error and return default values
            \Log::error('Dashboard stats error: ' . $e->getMessage());
            return [
                'totalCourses' => 0,
                'activeCourses' => 0,
                'totalParticipants' => 0,
                'totalTasks' => 0,
                'totalEmployees' => 0,
                'totalAssets' => 0,
                'totalMealPlans' => 0,
                'totalBudget' => 0,
            ];
        }
    }

    /**
     * Get recent data for dashboard display
     */
    private function getRecentData()
    {
        try {
            $today = Carbon::today();

            return [
                // Recent Courses
                'recentCourses' => CourseInstance::with('course')
                    ->where('start_date', '>=', $today)
                    ->where('status', 'scheduled')
                    ->orderBy('start_date')
                    ->limit(5)
                    ->get(),

                // Recent Participants
                'recentParticipants' => Participant::with('courses')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),

                // Recent Tasks
                'recentTasks' => Task::with('assignedTo')
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->orderBy('due_date')
                    ->limit(5)
                    ->get(),

                // Recent Meal Plans
                'recentMealPlans' => MealBreakPlan::with('createdBy')
                    ->orderBy('created_at', 'desc')
                    ->limit(3)
                    ->get(),

                // Upcoming Deadlines
                'upcomingDeadlines' => Task::where('due_date', '>=', $today)
                    ->whereNotIn('status', ['completed', 'cancelled'])
                    ->orderBy('due_date')
                    ->limit(5)
                    ->get(),
            ];
        } catch (\Exception $e) {
            // Log the error and return default values
            \Log::error('Dashboard recent data error: ' . $e->getMessage());
            return [
                'recentCourses' => collect(),
                'recentParticipants' => collect(),
                'recentTasks' => collect(),
                'recentMealPlans' => collect(),
                'upcomingDeadlines' => collect(),
            ];
        }
    }
}
