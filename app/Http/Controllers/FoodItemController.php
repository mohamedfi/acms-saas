<?php

namespace App\Http\Controllers;

use App\Models\FoodItem;
use App\Models\FoodItemLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FoodItemController extends Controller
{
    /**
     * Display a listing of food items.
     */
    public function index()
    {
        $foodItems = FoodItem::with(['locations'])
            ->orderBy('name')
            ->paginate(12);

        $categories = FoodItem::distinct()->pluck('category')->sort();
        $cuisineTypes = FoodItem::distinct()->pluck('cuisine_type')->filter()->sort();

        return Inertia::render('Catering/FoodItems/Index', [
            'foodItems' => $foodItems,
            'categories' => $categories,
            'cuisineTypes' => $cuisineTypes,
        ]);
    }

    /**
     * Show the form for creating a new food item.
     */
    public function create()
    {
        $categories = [
            'Main Course' => 'Main Course',
            'Appetizer' => 'Appetizer',
            'Dessert' => 'Dessert',
            'Beverage' => 'Beverage',
            'Side Dish' => 'Side Dish',
            'Soup' => 'Soup',
            'Salad' => 'Salad',
        ];

        $cuisineTypes = [
            'Italian' => 'Italian',
            'American' => 'American',
            'Arabic' => 'Arabic',
            'Asian' => 'Asian',
            'Indian' => 'Indian',
            'Mexican' => 'Mexican',
            'International' => 'International',
        ];

        $locations = FoodItemLocation::getAvailableLocations();

        return Inertia::render('Catering/FoodItems/Create', [
            'categories' => $categories,
            'cuisineTypes' => $cuisineTypes,
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created food item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'cuisine_type' => 'nullable|string|max:255',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_halal' => 'boolean',
            'is_gluten_free' => 'boolean',
            'allergen_info' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'nutritional_info' => 'nullable|string',
            'preparation_time_minutes' => 'nullable|integer|min:0',
            'serving_temperature' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'locations' => 'required|array|min:1',
            'locations.*.location' => 'required|string',
            'locations.*.price' => 'required|numeric|min:0',
            'locations.*.delivery_cost' => 'required|numeric|min:0',
            'locations.*.location_notes' => 'nullable|string',
        ]);

        $locations = $validated['locations'];
        unset($validated['locations']);

        $foodItem = FoodItem::create($validated);

        // Create location-based pricing
        foreach ($locations as $locationData) {
            FoodItemLocation::create([
                'food_item_id' => $foodItem->id,
                'location' => $locationData['location'],
                'price' => $locationData['price'],
                'delivery_cost' => $locationData['delivery_cost'],
                'location_notes' => $locationData['location_notes'] ?? null,
                'is_available' => true,
            ]);
        }

        return redirect()->route('food-items.index')
            ->with('success', 'Food item created successfully!');
    }

    /**
     * Display the specified food item.
     */
    public function show(FoodItem $foodItem)
    {
        $foodItem->load(['locations']);

        return Inertia::render('Catering/FoodItems/Show', [
            'foodItem' => $foodItem,
        ]);
    }

    /**
     * Show the form for editing the specified food item.
     */
    public function edit(FoodItem $foodItem)
    {
        $foodItem->load(['locations']);

        $categories = [
            'Main Course' => 'Main Course',
            'Appetizer' => 'Appetizer',
            'Dessert' => 'Dessert',
            'Beverage' => 'Beverage',
            'Side Dish' => 'Side Dish',
            'Soup' => 'Soup',
            'Salad' => 'Salad',
        ];

        $cuisineTypes = [
            'Italian' => 'Italian',
            'American' => 'American',
            'Arabic' => 'Arabic',
            'Asian' => 'Asian',
            'Indian' => 'Indian',
            'Mexican' => 'Mexican',
            'International' => 'International',
        ];

        $locations = FoodItemLocation::getAvailableLocations();

        return Inertia::render('Catering/FoodItems/Edit', [
            'foodItem' => $foodItem,
            'categories' => $categories,
            'cuisineTypes' => $cuisineTypes,
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified food item.
     */
    public function update(Request $request, FoodItem $foodItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'cuisine_type' => 'nullable|string|max:255',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_halal' => 'boolean',
            'is_gluten_free' => 'boolean',
            'allergen_info' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'nutritional_info' => 'nullable|string',
            'preparation_time_minutes' => 'nullable|integer|min:0',
            'serving_temperature' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'locations' => 'required|array|min:1',
            'locations.*.location' => 'required|string',
            'locations.*.price' => 'required|numeric|min:0',
            'locations.*.delivery_cost' => 'required|numeric|min:0',
            'locations.*.location_notes' => 'nullable|string',
        ]);

        $locations = $validated['locations'];
        unset($validated['locations']);

        $foodItem->update($validated);

        // Update location-based pricing
        $foodItem->locations()->delete(); // Remove existing locations

        foreach ($locations as $locationData) {
            FoodItemLocation::create([
                'food_item_id' => $foodItem->id,
                'location' => $locationData['location'],
                'price' => $locationData['price'],
                'delivery_cost' => $locationData['delivery_cost'],
                'location_notes' => $locationData['location_notes'] ?? null,
                'is_available' => true,
            ]);
        }

        return redirect()->route('food-items.index')
            ->with('success', 'Food item updated successfully!');
    }

    /**
     * Remove the specified food item.
     */
    public function destroy(FoodItem $foodItem)
    {
        // Check if food item is used in any orders
        if ($foodItem->individualOrders()->exists()) {
            return redirect()->route('food-items.index')
                ->with('error', 'Cannot delete food item that is used in orders.');
        }

        $foodItem->delete();

        return redirect()->route('food-items.index')
            ->with('success', 'Food item deleted successfully!');
    }

    /**
     * Toggle the availability of a food item.
     */
    public function toggleAvailability(FoodItem $foodItem)
    {
        $foodItem->update(['is_available' => !$foodItem->is_available]);

        $status = $foodItem->is_available ? 'enabled' : 'disabled';

        return redirect()->route('food-items.index')
            ->with('success', "Food item {$status} successfully!");
    }

    /**
     * Filter food items by various criteria.
     */
    public function filter(Request $request)
    {
        $query = FoodItem::query();

        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        if ($request->filled('cuisine_type')) {
            $query->byCuisineType($request->cuisine_type);
        }

        if ($request->filled('dietary')) {
            switch ($request->dietary) {
                case 'vegetarian':
                    $query->vegetarian();
                    break;
                case 'vegan':
                    $query->vegan();
                    break;
                case 'halal':
                    $query->halal();
                    break;
                case 'gluten_free':
                    $query->glutenFree();
                    break;
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('ingredients', 'like', "%{$search}%");
            });
        }

        $foodItems = $query->with(['locations'])
            ->orderBy('name')
            ->paginate(12);

        return response()->json($foodItems);
    }
}
