<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AssetCategory;

class AssetCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Media & Books',
                'description' => 'CDs, DVDs, books, training materials, and digital assets',
                'icon' => '📚',
                'color' => 'blue',
                'sort_order' => 1,
            ],
            [
                'name' => 'Furniture & Equipment',
                'description' => 'Chairs, tables, desks, storage units, and office furniture',
                'icon' => '🪑',
                'color' => 'green',
                'sort_order' => 2,
            ],
            [
                'name' => 'Electronics & IT',
                'description' => 'Computers, laptops, monitors, projectors, and IT equipment',
                'icon' => '💻',
                'color' => 'purple',
                'sort_order' => 3,
            ],
            [
                'name' => 'HVAC & Facilities',
                'description' => 'Air conditioners, heating systems, and facility equipment',
                'icon' => '❄️',
                'color' => 'cyan',
                'sort_order' => 4,
            ],
            [
                'name' => 'Transportation',
                'description' => 'Vehicles, maintenance tools, and transport equipment',
                'icon' => '🚗',
                'color' => 'orange',
                'sort_order' => 5,
            ],
            [
                'name' => 'Kitchen & Catering',
                'description' => 'Kitchen equipment, serving tools, and catering supplies',
                'icon' => '🍽️',
                'color' => 'red',
                'sort_order' => 6,
            ],
            [
                'name' => 'Training & Presentation',
                'description' => 'Training materials, presentation equipment, and learning tools',
                'icon' => '🎯',
                'color' => 'indigo',
                'sort_order' => 7,
            ],
            [
                'name' => 'Office Supplies',
                'description' => 'Stationery, office supplies, and consumables',
                'icon' => '📝',
                'color' => 'gray',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            AssetCategory::create($category);
        }
    }
}
