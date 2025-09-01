<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FoodItem;
use App\Models\FoodItemLocation;

class FoodItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $foodItems = [
            [
                'name' => 'Pizza Margherita',
                'description' => 'Classic Italian pizza with tomato sauce, mozzarella cheese, and fresh basil',
                'category' => 'Main Course',
                'cuisine_type' => 'Italian',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains dairy, gluten',
                'ingredients' => 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil',
                'nutritional_info' => 'Calories: 285, Protein: 12g, Carbs: 33g, Fat: 11g',
                'preparation_time_minutes' => 20,
                'serving_temperature' => 'Hot',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 220.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 200.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 180.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 180.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 200.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 220.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Chicken Burger',
                'description' => 'Grilled chicken breast burger with lettuce, tomato, and special sauce',
                'category' => 'Main Course',
                'cuisine_type' => 'American',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains gluten, may contain dairy',
                'ingredients' => 'Chicken breast, burger bun, lettuce, tomato, onion, special sauce',
                'nutritional_info' => 'Calories: 350, Protein: 28g, Carbs: 25g, Fat: 18g',
                'preparation_time_minutes' => 15,
                'serving_temperature' => 'Hot',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 180.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 160.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 150.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 150.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 160.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 180.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Caesar Salad',
                'description' => 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
                'category' => 'Appetizer',
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains dairy, gluten, eggs',
                'ingredients' => 'Romaine lettuce, Caesar dressing, croutons, parmesan cheese, black pepper',
                'nutritional_info' => 'Calories: 185, Protein: 8g, Carbs: 12g, Fat: 14g',
                'preparation_time_minutes' => 10,
                'serving_temperature' => 'Cold',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 150.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 130.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 120.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 120.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 130.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 150.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Beef Shawarma',
                'description' => 'Marinated beef strips wrapped in Arabic bread with tahini sauce and vegetables',
                'category' => 'Main Course',
                'cuisine_type' => 'Arabic',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains gluten, sesame',
                'ingredients' => 'Beef strips, Arabic bread, tahini sauce, lettuce, tomato, onion, pickles',
                'nutritional_info' => 'Calories: 420, Protein: 32g, Carbs: 28g, Fat: 22g',
                'preparation_time_minutes' => 12,
                'serving_temperature' => 'Hot',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 200.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 180.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 170.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 170.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 180.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 200.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Vegetable Pasta',
                'description' => 'Penne pasta with mixed vegetables in creamy tomato sauce',
                'category' => 'Main Course',
                'cuisine_type' => 'Italian',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains gluten, dairy',
                'ingredients' => 'Penne pasta, mixed vegetables, tomato sauce, cream, parmesan cheese, herbs',
                'nutritional_info' => 'Calories: 320, Protein: 14g, Carbs: 45g, Fat: 12g',
                'preparation_time_minutes' => 18,
                'serving_temperature' => 'Hot',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 190.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 170.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 160.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 160.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 170.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 190.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Chicken Rice Bowl',
                'description' => 'Steamed rice with grilled chicken, vegetables, and teriyaki sauce',
                'category' => 'Main Course',
                'cuisine_type' => 'Asian',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains soy, may contain gluten',
                'ingredients' => 'Steamed rice, grilled chicken, mixed vegetables, teriyaki sauce, sesame seeds',
                'nutritional_info' => 'Calories: 380, Protein: 26g, Carbs: 42g, Fat: 16g',
                'preparation_time_minutes' => 16,
                'serving_temperature' => 'Hot',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 210.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 190.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 180.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 180.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 190.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 210.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Fruit Smoothie',
                'description' => 'Fresh mixed fruit smoothie with yogurt and honey',
                'category' => 'Beverage',
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => true,
                'allergen_info' => 'Contains dairy',
                'ingredients' => 'Mixed fruits, yogurt, honey, ice',
                'nutritional_info' => 'Calories: 120, Protein: 4g, Carbs: 22g, Fat: 2g',
                'preparation_time_minutes' => 5,
                'serving_temperature' => 'Cold',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 80.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 70.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 65.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 65.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 70.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 80.00, 'delivery_cost' => 25.00],
                ]
            ],
            [
                'name' => 'Chocolate Cake',
                'description' => 'Rich chocolate cake with chocolate frosting and chocolate chips',
                'category' => 'Dessert',
                'cuisine_type' => 'International',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'is_gluten_free' => false,
                'allergen_info' => 'Contains dairy, eggs, gluten',
                'ingredients' => 'Flour, cocoa powder, sugar, eggs, milk, butter, chocolate chips, vanilla',
                'nutritional_info' => 'Calories: 280, Protein: 6g, Carbs: 38g, Fat: 14g',
                'preparation_time_minutes' => 0, // Pre-made
                'serving_temperature' => 'Room Temperature',
                'is_available' => true,
                'locations' => [
                    'Alexandria' => ['price' => 120.00, 'delivery_cost' => 25.00],
                    'Nasr City' => ['price' => 110.00, 'delivery_cost' => 20.00],
                    'BDC' => ['price' => 100.00, 'delivery_cost' => 15.00],
                    'Business Square' => ['price' => 100.00, 'delivery_cost' => 15.00],
                    'Dokki' => ['price' => 110.00, 'delivery_cost' => 20.00],
                    'Al-Rehab' => ['price' => 120.00, 'delivery_cost' => 25.00],
                ]
            ],
        ];

        foreach ($foodItems as $itemData) {
            $locations = $itemData['locations'];
            unset($itemData['locations']);

            $foodItem = FoodItem::create($itemData);

            // Create location-based pricing
            foreach ($locations as $location => $pricing) {
                FoodItemLocation::create([
                    'food_item_id' => $foodItem->id,
                    'location' => $location,
                    'price' => $pricing['price'],
                    'delivery_cost' => $pricing['delivery_cost'],
                    'is_available' => true,
                ]);
            }
        }

        $this->command->info('Food items seeded successfully with location-based pricing!');
    }
}
