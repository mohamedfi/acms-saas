<?php

namespace App\Http\Controllers;

use App\Models\MealBreakPlan;
use App\Models\DailyMealOrder;
use App\Models\IndividualFoodOrder;
use App\Models\FoodItem;
use App\Models\FoodItemLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class MealBreakPlanController extends Controller
{
    /**
     * Display a listing of meal break plans.
     */
    public function index()
    {
        try {
            $mealBreakPlans = MealBreakPlan::with(['createdBy', 'approvedBy'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Add debugging
            \Log::info('MealBreakPlan index - Data being sent:', [
                'count' => $mealBreakPlans->count(),
                'total' => $mealBreakPlans->total(),
                'has_data' => $mealBreakPlans->hasMorePages(),
                'data_structure' => $mealBreakPlans->toArray()
            ]);

            return Inertia::render('Catering/MealBreakPlans/Index', [
                'mealBreakPlans' => $mealBreakPlans,
            ]);
        } catch (\Exception $e) {
            Log::error('MealBreakPlan index error: ' . $e->getMessage());

            // Return empty paginated collection on error
            $emptyCollection = new \Illuminate\Pagination\LengthAwarePaginator(
                collect([]),
                0,
                10,
                1
            );

            return Inertia::render('Catering/MealBreakPlans/Index', [
                'mealBreakPlans' => $emptyCollection,
            ]);
        }
    }

    /**
     * Show the form for creating a new meal break plan.
     */
    public function create()
    {
        return Inertia::render('Catering/MealBreakPlans/Create');
    }

    /**
     * Store a newly created meal break plan.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'notes' => 'nullable|string',
            'employee_id' => 'nullable|exists:employees,id',
            'department_id' => 'nullable|exists:departments,id',
            'total_food_cost' => 'nullable|numeric|min:0',
            'total_delivery_cost' => 'nullable|numeric|min:0',
            'grand_total' => 'nullable|numeric|min:0',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string|max:255',
            'items.*.cost' => 'required|numeric|min:0',
            'items.*.delivery_cost' => 'nullable|numeric|min:0',
            'items.*.location' => 'nullable|string|max:255',
            'items.*.department' => 'nullable|string|max:255',
            'items.*.course_id' => 'required|exists:courses,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.supplier' => 'nullable|string|max:255',
            'items.*.day' => 'required|string|max:255',
        ]);

        $mealBreakPlan = MealBreakPlan::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'notes' => $validated['notes'],
            'employee_id' => $validated['employee_id'] ?? null,
            'department_id' => $validated['department_id'] ?? null,
            'total_food_cost' => $validated['total_food_cost'] ?? 0,
            'total_delivery_cost' => $validated['total_delivery_cost'] ?? 0,
            'grand_total' => $validated['grand_total'] ?? 0,
            'created_by' => Auth::id(),
            'total_days' => Carbon::parse($validated['start_date'])->diffInDays($validated['end_date']) + 1,
            'status' => 'draft',
        ]);

        // Store the items if provided
        if (!empty($validated['items'])) {
            // Group items by supplier to calculate delivery costs correctly
            $supplierGroups = [];
            foreach ($validated['items'] as $itemData) {
                $supplier = $itemData['supplier'] ?? 'No Supplier';
                if (!isset($supplierGroups[$supplier])) {
                    $supplierGroups[$supplier] = [];
                }
                $supplierGroups[$supplier][] = $itemData;
            }

            foreach ($validated['items'] as $itemData) {
                $mealBreakPlan->items()->create([
                    'name' => $itemData['name'],
                    'cost' => $itemData['cost'],
                    'delivery_cost' => $itemData['delivery_cost'] ?? 0,
                    'location' => $itemData['location'],
                    'department' => $itemData['department'],
                    'course_id' => $itemData['course_id'],
                    'quantity' => $itemData['quantity'],
                    'supplier' => $itemData['supplier'],
                    'day' => $itemData['day'],
                    'total' => ($itemData['cost'] ?? 0) * $itemData['quantity'], // Only cost × quantity, delivery is per supplier
                ]);
            }
        }

        return redirect()->route('catering.meal-break-plans.show', $mealBreakPlan)
            ->with('success', 'Meal break plan created successfully!');
    }

    /**
     * Display the specified meal break plan.
     */
    public function show(MealBreakPlan $mealBreakPlan)
    {
        $mealBreakPlan->load([
            'dailyMealOrders.individualFoodOrders.foodItem',
            'createdBy',
            'approvedBy',
            'employee',
            'department'
        ]);

        $dailyBreakdown = $mealBreakPlan->getDailyBreakdown();
        $mealBreakPlan->calculateTotals();

        return Inertia::render('Catering/MealBreakPlans/Show', [
            'mealBreakPlan' => $mealBreakPlan,
            'dailyBreakdown' => $dailyBreakdown,
        ]);
    }

    /**
     * Show the form for editing the specified meal break plan.
     */
    public function edit(MealBreakPlan $mealBreakPlan)
    {
        if (!$mealBreakPlan->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.show', $mealBreakPlan)
                ->with('error', 'This meal break plan cannot be edited.');
        }

        return Inertia::render('Catering/MealBreakPlans/Edit', [
            'mealBreakPlan' => $mealBreakPlan,
        ]);
    }

    /**
     * Update the specified meal break plan.
     */
    public function update(Request $request, MealBreakPlan $mealBreakPlan)
    {
        if (!$mealBreakPlan->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.show', $mealBreakPlan)
                ->with('error', 'This meal break plan cannot be edited.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'notes' => 'nullable|string',
        ]);

        $mealBreakPlan->update([
            ...$validated,
            'total_days' => Carbon::parse($validated['start_date'])->diffInDays($validated['end_date']) + 1,
        ]);

        $mealBreakPlan->calculateTotals();

        return redirect()->route('catering.meal-break-plans.show', $mealBreakPlan)
            ->with('success', 'Meal break plan updated successfully!');
    }

    /**
     * Remove the specified meal break plan.
     */
    public function destroy(MealBreakPlan $mealBreakPlan)
    {
        if ($mealBreakPlan->status !== 'draft') {
            return redirect()->route('catering.meal-break-plans.index')
                ->with('error', 'Only draft meal break plans can be deleted.');
        }

        $mealBreakPlan->delete();

        return redirect()->route('catering.meal-break-plans.index')
            ->with('success', 'Meal break plan deleted successfully!');
    }

    /**
     * Approve the meal break plan.
     */
    public function approve(MealBreakPlan $meal_break_plan)
    {
        if (!$meal_break_plan->canBeApproved()) {
            return redirect()->route('catering.meal-break-plans.show', $meal_break_plan)
                ->with('error', 'This meal break plan cannot be approved.');
        }

        $meal_break_plan->approve(Auth::user());

        return redirect()->route('catering.meal-break-plans.show', $meal_break_plan)
            ->with('success', 'Meal break plan approved successfully!');
    }

    /**
     * Complete the meal break plan.
     */
    public function complete(MealBreakPlan $meal_break_plan)
    {
        $meal_break_plan->complete();

        return redirect()->route('catering.meal-break-plans.show', $meal_break_plan)
            ->with('success', 'Meal break plan marked as completed!');
    }

    /**
     * Cancel the meal break plan.
     */
    public function cancel(MealBreakPlan $meal_break_plan)
    {
        if (!$meal_break_plan->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.show', $meal_break_plan)
                ->with('error', 'This meal break plan cannot be cancelled.');
        }

        $meal_break_plan->cancel();

        return redirect()->route('catering.meal-break-plans.show', $meal_break_plan)
            ->with('success', 'Meal break plan cancelled successfully!');
    }

    /**
     * Display daily orders for a meal break plan.
     */
    public function dailyOrders(MealBreakPlan $meal_break_plan)
    {
        $dailyOrders = $meal_break_plan->dailyMealOrders()
            ->with(['individualFoodOrders.foodItem'])
            ->orderBy('order_date')
            ->get();

        return Inertia::render('Catering/MealBreakPlans/DailyOrders', [
            'mealBreakPlan' => $meal_break_plan,
            'dailyOrders' => $dailyOrders,
        ]);
    }

    /**
     * Show the form for creating a daily meal order.
     */
    public function createDailyOrder(MealBreakPlan $meal_break_plan)
    {
        $locations = FoodItemLocation::getAvailableLocations();
        $courses = $this->getAvailableCourses();

        return Inertia::render('Catering/MealBreakPlans/CreateDailyOrder', [
            'mealBreakPlan' => $meal_break_plan,
            'locations' => $locations,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created daily meal order.
     */
    public function storeDailyOrder(Request $request, MealBreakPlan $meal_break_plan)
    {
        $validated = $request->validate([
            'order_date' => 'required|date|between:' . $meal_break_plan->start_date . ',' . $meal_break_plan->end_date,
            'course_name' => 'required|string|max:255',
            'number_of_attendance' => 'required|integer|min:1',
            'location' => 'required|string',
            'delivery_cost' => 'required|numeric|min:0',
            'special_instructions' => 'nullable|string',
        ]);

        $dailyOrder = DailyMealOrder::create([
            ...$validated,
            'meal_break_plan_id' => $meal_break_plan->id,
            'day_name' => Carbon::parse($validated['order_date'])->format('l'),
        ]);

        $meal_break_plan->calculateTotals();

        return redirect()->route('catering.meal-break-plans.daily-orders', $meal_break_plan)
            ->with('success', 'Daily meal order created successfully!');
    }

    /**
     * Show the form for editing a daily meal order.
     */
    public function editDailyOrder(DailyMealOrder $dailyOrder)
    {
        if (!$dailyOrder->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.daily-orders', $dailyOrder->mealBreakPlan)
                ->with('error', 'This daily order cannot be edited.');
        }

        $locations = FoodItemLocation::getAvailableLocations();
        $courses = $this->getAvailableCourses();

        return Inertia::render('Catering/MealBreakPlans/EditDailyOrder', [
            'dailyOrder' => $dailyOrder,
            'locations' => $locations,
            'courses' => $courses,
        ]);
    }

    /**
     * Update the specified daily meal order.
     */
    public function updateDailyOrder(Request $request, DailyMealOrder $dailyOrder)
    {
        if (!$dailyOrder->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.daily-orders', $dailyOrder->mealBreakPlan)
                ->with('error', 'This daily order cannot be edited.');
        }

        $validated = $request->validate([
            'order_date' => 'required|date|between:' . $dailyOrder->mealBreakPlan->start_date . ',' . $dailyOrder->mealBreakPlan->end_date,
            'course_name' => 'required|string|max:255',
            'number_of_attendance' => 'required|integer|min:1',
            'location' => 'required|string',
            'delivery_cost' => 'required|numeric|min:0',
            'special_instructions' => 'nullable|string',
        ]);

        $dailyOrder->update([
            ...$validated,
            'day_name' => Carbon::parse($validated['order_date'])->format('l'),
        ]);

        $dailyOrder->mealBreakPlan->calculateTotals();

        return redirect()->route('catering.meal-break-plans.daily-orders', $dailyOrder->mealBreakPlan)
            ->with('success', 'Daily meal order updated successfully!');
    }

    /**
     * Remove the specified daily meal order.
     */
    public function destroyDailyOrder(DailyMealOrder $dailyOrder)
    {
        if (!$dailyOrder->canBeEdited()) {
            return redirect()->route('catering.meal-break-plans.daily-orders', $dailyOrder->mealBreakPlan)
                ->with('error', 'This daily order cannot be deleted.');
        }

        $mealBreakPlan = $dailyOrder->mealBreakPlan;
        $dailyOrder->delete();

        $mealBreakPlan->calculateTotals();

        return redirect()->route('catering.meal-break-plans.daily-orders', $mealBreakPlan)
            ->with('success', 'Daily meal order deleted successfully!');
    }

    /**
     * Display food orders for a daily meal order.
     */
    public function foodOrders(DailyMealOrder $dailyOrder)
    {
        $foodOrders = $dailyOrder->individualFoodOrders()
            ->with('foodItem')
            ->orderBy('created_at')
            ->get();

        $foodItems = FoodItem::available()
            ->with(['locations' => function ($query) use ($dailyOrder) {
                $query->where('location', $dailyOrder->location);
            }])
            ->get();

        return Inertia::render('Catering/MealBreakPlans/FoodOrders', [
            'dailyOrder' => $dailyOrder,
            'foodOrders' => $foodOrders,
            'foodItems' => $foodItems,
        ]);
    }

    /**
     * Show the form for creating a food order.
     */
    public function createFoodOrder(DailyMealOrder $dailyOrder)
    {
        $foodItems = FoodItem::available()
            ->with(['locations' => function ($query) use ($dailyOrder) {
                $query->where('location', $dailyOrder->location);
            }])
            ->get();

        return Inertia::render('Catering/MealBreakPlans/CreateFoodOrder', [
            'dailyOrder' => $dailyOrder,
            'foodItems' => $foodItems,
        ]);
    }

    /**
     * Store a newly created food order.
     */
    public function storeFoodOrder(Request $request, DailyMealOrder $dailyOrder)
    {
        $validated = $request->validate([
            'food_item_id' => 'required|exists:food_items,id',
            'customer_name' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'special_instructions' => 'nullable|string',
        ]);

        $foodItem = FoodItem::findOrFail($validated['food_item_id']);
        $locationPricing = $foodItem->locations()->where('location', $dailyOrder->location)->first();

        if (!$locationPricing) {
            return back()->withErrors(['food_item_id' => 'This food item is not available at the selected location.']);
        }

        $individualFoodOrder = IndividualFoodOrder::create([
            ...$validated,
            'daily_meal_order_id' => $dailyOrder->id,
            'unit_price' => $locationPricing->price,
            'total_price' => $locationPricing->price * $validated['quantity'],
        ]);

        $dailyOrder->calculateTotals();
        $dailyOrder->mealBreakPlan->calculateTotals();

        return redirect()->route('catering.daily-orders.food-orders', $dailyOrder)
            ->with('success', 'Food order created successfully!');
    }

    /**
     * Show the form for editing a food order.
     */
    public function editFoodOrder(IndividualFoodOrder $foodOrder)
    {
        if (!$foodOrder->canBeEdited()) {
            return redirect()->route('catering.daily-orders.food-orders', $foodOrder->dailyMealOrder)
                ->with('error', 'This food order cannot be edited.');
        }

        $foodItems = FoodItem::available()
            ->with(['locations' => function ($query) use ($foodOrder) {
                $query->where('location', $foodOrder->dailyMealOrder->location);
            }])
            ->get();

        return Inertia::render('Catering/MealBreakPlans/EditFoodOrder', [
            'foodOrder' => $foodOrder,
            'foodItems' => $foodItems,
        ]);
    }

    /**
     * Update the specified food order.
     */
    public function updateFoodOrder(Request $request, IndividualFoodOrder $foodOrder)
    {
        if (!$foodOrder->canBeEdited()) {
            return redirect()->route('catering.daily-orders.food-orders', $foodOrder->dailyMealOrder)
                ->with('error', 'This food order cannot be edited.');
        }

        $validated = $request->validate([
            'food_item_id' => 'required|exists:food_items,id',
            'customer_name' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'special_instructions' => 'nullable|string',
        ]);

        $foodItem = FoodItem::findOrFail($validated['food_item_id']);
        $locationPricing = $foodItem->locations()->where('location', $foodOrder->dailyMealOrder->location)->first();

        if (!$locationPricing) {
            return back()->withErrors(['food_item_id' => 'This food item is not available at the selected location.']);
        }

        $foodOrder->update([
            ...$validated,
            'unit_price' => $locationPricing->price,
            'total_price' => $locationPricing->price * $validated['quantity'],
        ]);

        $foodOrder->dailyMealOrder->calculateTotals();
        $foodOrder->dailyMealOrder->mealBreakPlan->calculateTotals();

        return redirect()->route('catering.daily-orders.food-orders', $foodOrder->dailyMealOrder)
            ->with('success', 'Food order updated successfully!');
    }

    /**
     * Remove the specified food order.
     */
    public function destroyFoodOrder(IndividualFoodOrder $foodOrder)
    {
        if (!$foodOrder->canBeEdited()) {
            return redirect()->route('catering.daily-orders.food-orders', $foodOrder->dailyMealOrder)
                ->with('error', 'This food order cannot be deleted.');
        }

        $dailyOrder = $foodOrder->dailyMealOrder;
        $foodOrder->delete();

        $dailyOrder->calculateTotals();
        $dailyOrder->mealBreakPlan->calculateTotals();

        return redirect()->route('catering.daily-orders.food-orders', $dailyOrder)
            ->with('success', 'Food order deleted successfully!');
    }

    /**
     * Get available courses for meal break plans.
     */
    private function getAvailableCourses(): array
    {
        return [
            'Project Management' => 'Project Management',
            'Skills Development' => 'Skills Development',
            'Communication Management' => 'Communication Management',
            'Business Administration' => 'Business Administration',
            'Resource Management' => 'Resource Management',
            'Nursing' => 'Nursing',
            'Electronic Maintenance' => 'Electronic Maintenance',
            'Electronic Format' => 'Electronic Format',
        ];
    }
}
