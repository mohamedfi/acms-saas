<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CateringService;
use App\Models\MealPlan;
use App\Models\DietaryRequirement;
use App\Models\CateringOrder;
use App\Models\ArchivedCourse;
use App\Models\Employee;

class CateringController extends Controller
{
    public function index()
    {
        $cateringServices = CateringService::with('dietaryRequirements')
            ->available()
            ->get()
            ->groupBy('type');

        $mealPlans = MealPlan::active()->with('items.cateringService')->get();
        $dietaryRequirements = DietaryRequirement::active()->get();

        $recentOrders = CateringOrder::with(['course', 'orderedBy'])
            ->latest()
            ->take(5)
            ->get();

        $upcomingOrders = CateringOrder::with(['course', 'orderedBy'])
            ->upcoming()
            ->take(5)
            ->get();

        $stats = [
            'total_services' => CateringService::count(),
            'available_services' => CateringService::available()->count(),
            'total_orders' => CateringOrder::count(),
            'pending_orders' => CateringOrder::pending()->count(),
            'confirmed_orders' => CateringOrder::confirmed()->count(),
            'total_meal_plans' => MealPlan::count(),
            'active_meal_plans' => MealPlan::active()->count(),
            'total_dietary_requirements' => DietaryRequirement::count(),
        ];

        $courses = ArchivedCourse::select('id', 'course_name', 'start_date', 'end_date')
            ->where('start_date', '>=', now()->subDays(30))
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('Catering/Index', [
            'cateringServices' => $cateringServices,
            'mealPlans' => $mealPlans,
            'dietaryRequirements' => $dietaryRequirements,
            'recentOrders' => $recentOrders,
            'upcomingOrders' => $upcomingOrders,
            'stats' => $stats,
            'courses' => $courses,
        ]);
    }

    public function services()
    {
        $services = CateringService::with(['dietaryRequirements', 'employees'])
            ->available()
            ->get();

        return Inertia::render('Catering/Services', [
            'services' => $services,
        ]);
    }

    public function editService(CateringService $service)
    {
        $service->load(['dietaryRequirements', 'employees']);
        $dietaryRequirements = DietaryRequirement::active()->get();

        // Get active employees, handle case where they might not have users
        try {
            $employees = Employee::active()->get()->map(function ($employee) {
                // Create a display name from employee data since user relationship might not exist
                $employee->display_name = $employee->first_name . ' ' . $employee->last_name;
                $employee->position_display = $employee->position;
                return $employee;
            });
        } catch (\Exception $e) {
            // Fallback to all employees if active scope fails
            $employees = Employee::all()->map(function ($employee) {
                $employee->display_name = $employee->first_name . ' ' . $employee->last_name;
                $employee->position_display = $employee->position;
                return $employee;
            });
        }

        // Get available catering roles
        $cateringRoles = \App\Models\CateringRole::active()->ordered()->get();

        return Inertia::render('Catering/EditService', [
            'service' => $service,
            'dietaryRequirements' => $dietaryRequirements,
            'employees' => $employees,
            'cateringRoles' => $cateringRoles,
        ]);
    }

    public function updateService(Request $request, CateringService $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:breakfast,lunch,dinner,snack,beverage',
            'price_per_person' => 'required|numeric|min:0',
            'cuisine_type' => 'nullable|string|max:100',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_halal' => 'boolean',
            'is_gluten_free' => 'boolean',
            'preparation_time_minutes' => 'required|integer|min:1',
            'serving_temperature' => 'nullable|integer',
            'allergen_info' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'nutritional_info' => 'nullable|string',
            'is_available' => 'boolean',
            'dietary_requirements' => 'array',
            'employees' => 'array',
        ]);

        $service->update($validated);

        // Update dietary requirements
        if (isset($validated['dietary_requirements'])) {
            $service->dietaryRequirements()->sync($validated['dietary_requirements']);
        }

        // Update employee assignments
        if (isset($validated['employees'])) {
            $employeeData = [];
            foreach ($validated['employees'] as $employee) {
                $employeeData[$employee['employee_id']] = [
                    'role' => $employee['role'],
                    'notes' => $employee['notes'] ?? null,
                    'is_primary' => $employee['is_primary'] ?? false,
                    'is_available' => $employee['is_available'] ?? true,
                ];
            }
            $service->employees()->sync($employeeData);
        }

        return redirect()->route('catering.services')->with('success', 'Service updated successfully!');
    }

    public function toggleAvailability(CateringService $service)
    {
        $service->update(['is_available' => !$service->is_available]);

        $status = $service->is_available ? 'enabled' : 'disabled';
        return redirect()->route('catering.services')->with('success', "Service {$status} successfully!");
    }

    public function mealPlans()
    {
        $mealPlans = MealPlan::active()
            ->with('items.cateringService')
            ->get();

        return Inertia::render('Catering/MealPlans', [
            'mealPlans' => $mealPlans,
        ]);
    }

    public function createMealPlan()
    {
        $cateringServices = CateringService::available()->get();

        return Inertia::render('Catering/CreateMealPlan', [
            'cateringServices' => $cateringServices,
        ]);
    }

    public function storeMealPlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|in:daily,weekly,monthly,custom',
            'duration_value' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'includes_breakfast' => 'boolean',
            'includes_lunch' => 'boolean',
            'includes_dinner' => 'boolean',
            'includes_snacks' => 'boolean',
            'includes_beverages' => 'boolean',
            'special_notes' => 'nullable|string',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.catering_service_id' => 'required|exists:catering_services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            $mealPlan = MealPlan::create($validated);

            // Create meal plan items
            if (isset($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $mealPlan->items()->create([
                        'catering_service_id' => $item['catering_service_id'],
                        'quantity' => $item['quantity'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            }

            return redirect()->route('catering.meal-plans')->with('success', 'Meal plan created successfully!');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', 'Error creating meal plan: ' . $e->getMessage());
        }
    }

    public function editMealPlan(MealPlan $mealPlan)
    {
        $mealPlan->load('items.cateringService');
        $cateringServices = CateringService::available()->get();

        return Inertia::render('Catering/EditMealPlan', [
            'mealPlan' => $mealPlan,
            'cateringServices' => $cateringServices,
        ]);
    }

    public function updateMealPlan(Request $request, MealPlan $mealPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|in:daily,weekly,monthly,custom',
            'duration_value' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'includes_breakfast' => 'boolean',
            'includes_lunch' => 'boolean',
            'includes_dinner' => 'boolean',
            'includes_snacks' => 'boolean',
            'includes_beverages' => 'boolean',
            'special_notes' => 'nullable|string',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.catering_service_id' => 'required|exists:catering_services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            $mealPlan->update($validated);

            // Update meal plan items
            if (isset($validated['items'])) {
                // Delete existing items
                $mealPlan->items()->delete();

                // Create new items
                foreach ($validated['items'] as $item) {
                    $mealPlan->items()->create([
                        'catering_service_id' => $item['catering_service_id'],
                        'quantity' => $item['quantity'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            }

            return redirect()->route('catering.meal-plans')->with('success', 'Meal plan updated successfully!');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', 'Error updating meal plan: ' . $e->getMessage());
        }
    }

    public function destroyMealPlan(MealPlan $mealPlan)
    {
        try {
            $mealPlan->items()->delete();
            $mealPlan->delete();

            return redirect()->route('catering.meal-plans')->with('success', 'Meal plan deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting meal plan: ' . $e->getMessage());
        }
    }

    public function toggleMealPlanStatus(MealPlan $mealPlan)
    {
        $mealPlan->update(['is_active' => !$mealPlan->is_active]);

        $status = $mealPlan->is_active ? 'activated' : 'deactivated';
        return redirect()->route('catering.meal-plans')->with('success', "Meal plan {$status} successfully!");
    }

    public function orders()
    {
        $orders = CateringOrder::with(['course', 'orderedBy', 'orderItems.cateringService'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Catering/Orders', [
            'orders' => $orders,
        ]);
    }

    public function createOrder()
    {
        $services = CateringService::available()->get();
        $courses = ArchivedCourse::select('id', 'course_name', 'start_date', 'end_date')
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('Catering/CreateOrder', [
            'services' => $services,
            'courses' => $courses,
        ]);
    }
}
