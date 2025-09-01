<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CateringService;
use App\Models\DietaryRequirement;

class CateringServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cateringServices = [
            [
                'name' => 'Continental Breakfast',
                'description' => 'Light breakfast with pastries, fruits, and coffee/tea',
                'type' => 'breakfast',
                'price_per_person' => 12.50,
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'preparation_time_minutes' => 20,
                'serving_temperature' => 65,
                'allergen_info' => 'Contains gluten, dairy, eggs',
                'ingredients' => 'Croissants, muffins, fresh fruits, coffee, tea, juice',
                'nutritional_info' => 'Calories: 300-400, Protein: 8g, Carbs: 45g, Fat: 15g',
                'is_available' => true,
            ],
            [
                'name' => 'Mediterranean Lunch',
                'description' => 'Healthy Mediterranean-style lunch with grilled chicken, quinoa, and vegetables',
                'type' => 'lunch',
                'price_per_person' => 18.75,
                'cuisine_type' => 'Mediterranean',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => true,
                'preparation_time_minutes' => 45,
                'serving_temperature' => 70,
                'allergen_info' => 'Contains dairy',
                'ingredients' => 'Grilled chicken, quinoa, cherry tomatoes, cucumber, olives, feta cheese, olive oil',
                'nutritional_info' => 'Calories: 450-550, Protein: 35g, Carbs: 40g, Fat: 20g',
                'is_available' => true,
            ],
            [
                'name' => 'Vegan Buddha Bowl',
                'description' => 'Nutritious vegan bowl with roasted vegetables, chickpeas, and tahini dressing',
                'type' => 'lunch',
                'price_per_person' => 16.50,
                'cuisine_type' => 'Plant-Based',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'is_halal' => true,
                'is_gluten_free' => true,
                'preparation_time_minutes' => 40,
                'serving_temperature' => 65,
                'allergen_info' => 'Contains sesame (tahini)',
                'ingredients' => 'Quinoa, roasted sweet potato, chickpeas, kale, avocado, tahini dressing',
                'nutritional_info' => 'Calories: 400-500, Protein: 15g, Carbs: 55g, Fat: 18g',
                'is_available' => true,
            ],
            [
                'name' => 'Arabic Dinner',
                'description' => 'Traditional Arabic dinner with lamb, rice, and mezze',
                'type' => 'dinner',
                'price_per_person' => 24.00,
                'cuisine_type' => 'Arabic',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'preparation_time_minutes' => 60,
                'serving_temperature' => 75,
                'allergen_info' => 'Contains gluten, dairy',
                'ingredients' => 'Lamb shawarma, basmati rice, hummus, tabbouleh, pita bread, yogurt sauce',
                'nutritional_info' => 'Calories: 600-700, Protein: 40g, Carbs: 65g, Fat: 25g',
                'is_available' => true,
            ],
            [
                'name' => 'Fresh Fruit Platter',
                'description' => 'Assorted fresh seasonal fruits with yogurt dip',
                'type' => 'snack',
                'price_per_person' => 8.25,
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => true,
                'preparation_time_minutes' => 15,
                'serving_temperature' => 5,
                'allergen_info' => 'Contains dairy',
                'ingredients' => 'Seasonal fruits, Greek yogurt, honey, mint',
                'nutritional_info' => 'Calories: 150-200, Protein: 5g, Carbs: 30g, Fat: 2g',
                'is_available' => true,
            ],
            [
                'name' => 'Artisan Coffee Service',
                'description' => 'Premium coffee and tea service with pastries',
                'type' => 'beverage',
                'price_per_person' => 6.50,
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'preparation_time_minutes' => 10,
                'serving_temperature' => 85,
                'allergen_info' => 'Contains gluten, dairy',
                'ingredients' => 'Premium coffee beans, loose leaf tea, milk alternatives, sugar, pastries',
                'nutritional_info' => 'Calories: 100-150, Protein: 2g, Carbs: 20g, Fat: 4g',
                'is_available' => true,
            ],
            [
                'name' => 'Gluten-Free Pasta Bar',
                'description' => 'Build-your-own pasta with gluten-free options and fresh sauces',
                'type' => 'lunch',
                'price_per_person' => 19.50,
                'cuisine_type' => 'Italian',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => true,
                'preparation_time_minutes' => 30,
                'serving_temperature' => 70,
                'allergen_info' => 'Contains dairy, eggs',
                'ingredients' => 'Gluten-free pasta, tomato sauce, pesto, alfredo, vegetables, parmesan',
                'nutritional_info' => 'Calories: 500-600, Protein: 20g, Carbs: 70g, Fat: 18g',
                'is_available' => true,
            ],
            [
                'name' => 'Middle Eastern Mezze',
                'description' => 'Assorted Middle Eastern appetizers and dips',
                'type' => 'snack',
                'price_per_person' => 14.75,
                'cuisine_type' => 'Middle Eastern',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'is_halal' => true,
                'is_gluten_free' => false,
                'preparation_time_minutes' => 25,
                'serving_temperature' => 65,
                'allergen_info' => 'Contains gluten, sesame',
                'ingredients' => 'Hummus, baba ganoush, falafel, tabbouleh, pita bread, olives',
                'nutritional_info' => 'Calories: 300-400, Protein: 12g, Carbs: 45g, Fat: 15g',
                'is_available' => true,
            ],
        ];

        foreach ($cateringServices as $service) {
            $cateringService = CateringService::create($service);

            // Attach compatible dietary requirements
            $this->attachDietaryRequirements($cateringService);
        }
    }

    private function attachDietaryRequirements(CateringService $service): void
    {
        $requirements = DietaryRequirement::all();

        foreach ($requirements as $requirement) {
            $isCompatible = $this->checkCompatibility($service, $requirement);

            $service->dietaryRequirements()->attach($requirement->id, [
                'is_compatible' => $isCompatible,
                'notes' => $isCompatible ? 'Fully compatible' : 'May require modifications'
            ]);
        }
    }

    private function checkCompatibility(CateringService $service, DietaryRequirement $requirement): bool
    {
        return match ($requirement->name) {
            'Vegetarian' => $service->is_vegetarian,
            'Vegan' => $service->is_vegan,
            'Halal' => $service->is_halal,
            'Gluten-Free' => $service->is_gluten_free,
            'Dairy-Free' => !str_contains(strtolower($service->ingredients ?? ''), 'milk') &&
                !str_contains(strtolower($service->ingredients ?? ''), 'cheese') &&
                !str_contains(strtolower($service->ingredients ?? ''), 'yogurt'),
            'Nut-Free' => !str_contains(strtolower($service->ingredients ?? ''), 'nuts') &&
                !str_contains(strtolower($service->ingredients ?? ''), 'almonds') &&
                !str_contains(strtolower($service->ingredients ?? ''), 'peanuts'),
            default => true,
        };
    }
}
