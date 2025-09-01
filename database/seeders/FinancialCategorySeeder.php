<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FinancialCategory;

class FinancialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Income Categories
            [
                'name' => 'course_fees',
                'display_name' => 'Course Fees',
                'type' => 'income',
                'description' => 'Revenue from training courses and workshops',
                'icon' => '📚',
                'color' => 'green',
                'sort_order' => 1,
            ],
            [
                'name' => 'consulting',
                'display_name' => 'Consulting Services',
                'type' => 'income',
                'description' => 'Professional consulting and advisory services',
                'icon' => '💼',
                'color' => 'blue',
                'sort_order' => 2,
            ],
            [
                'name' => 'catering_services',
                'display_name' => 'Catering Services',
                'type' => 'income',
                'description' => 'Revenue from catering and food services',
                'icon' => '🍽️',
                'color' => 'orange',
                'sort_order' => 3,
            ],
            [
                'name' => 'logistics_services',
                'display_name' => 'Logistics Services',
                'type' => 'income',
                'description' => 'Transportation and logistics services',
                'icon' => '🚚',
                'color' => 'purple',
                'sort_order' => 4,
            ],
            [
                'name' => 'other_income',
                'display_name' => 'Other Income',
                'type' => 'income',
                'description' => 'Miscellaneous income sources',
                'icon' => '💰',
                'color' => 'gray',
                'sort_order' => 5,
            ],

            // Expense Categories
            [
                'name' => 'personnel',
                'display_name' => 'Personnel Costs',
                'type' => 'expense',
                'description' => 'Salaries, wages, and employee benefits',
                'icon' => '👥',
                'color' => 'red',
                'sort_order' => 6,
            ],
            [
                'name' => 'office_supplies',
                'display_name' => 'Office Supplies',
                'type' => 'expense',
                'description' => 'Office equipment, stationery, and supplies',
                'icon' => '📁',
                'color' => 'brown',
                'sort_order' => 7,
            ],
            [
                'name' => 'marketing',
                'display_name' => 'Marketing & Advertising',
                'type' => 'expense',
                'description' => 'Marketing campaigns, advertising, and promotions',
                'icon' => '📢',
                'color' => 'pink',
                'sort_order' => 8,
            ],
            [
                'name' => 'travel',
                'display_name' => 'Travel & Accommodation',
                'type' => 'expense',
                'description' => 'Business travel, hotels, and transportation',
                'icon' => '✈️',
                'color' => 'cyan',
                'sort_order' => 9,
            ],
            [
                'name' => 'utilities',
                'display_name' => 'Utilities & Rent',
                'type' => 'expense',
                'description' => 'Office rent, electricity, water, internet',
                'icon' => '🏢',
                'color' => 'yellow',
                'sort_order' => 10,
            ],
            [
                'name' => 'catering_costs',
                'display_name' => 'Catering Costs',
                'type' => 'expense',
                'description' => 'Food, beverages, and catering supplies',
                'icon' => '🍕',
                'color' => 'orange',
                'sort_order' => 11,
            ],
            [
                'name' => 'logistics_costs',
                'display_name' => 'Logistics Costs',
                'type' => 'expense',
                'description' => 'Transportation, fuel, and vehicle maintenance',
                'icon' => '⛽',
                'color' => 'purple',
                'sort_order' => 12,
            ],
            [
                'name' => 'training_materials',
                'display_name' => 'Training Materials',
                'type' => 'expense',
                'description' => 'Course materials, books, and educational resources',
                'icon' => '📖',
                'color' => 'indigo',
                'sort_order' => 13,
            ],
            [
                'name' => 'maintenance',
                'display_name' => 'Maintenance & Repairs',
                'type' => 'expense',
                'description' => 'Equipment maintenance and facility repairs',
                'icon' => '🔧',
                'color' => 'gray',
                'sort_order' => 14,
            ],
            [
                'name' => 'other_expenses',
                'display_name' => 'Other Expenses',
                'type' => 'expense',
                'description' => 'Miscellaneous business expenses',
                'icon' => '💸',
                'color' => 'red',
                'sort_order' => 15,
            ],
        ];

        foreach ($categories as $category) {
            FinancialCategory::create($category);
        }

        $this->command->info('Financial categories seeded successfully!');
    }
}
