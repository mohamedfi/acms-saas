<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CateringRole;

class CateringRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Executive Chef',
                'slug' => 'executive_chef',
                'description' => 'Head chef responsible for menu planning, kitchen management, and overall culinary direction',
                'icon' => '👨‍🍳',
                'hierarchy_level' => 1,
                'is_active' => true,
                'required_skills' => ['Culinary Arts', 'Kitchen Management', 'Menu Planning', 'Food Safety', 'Leadership'],
            ],
            [
                'name' => 'Sous Chef',
                'slug' => 'sous_chef',
                'description' => 'Second-in-command chef who assists the executive chef and manages kitchen operations',
                'icon' => '👩‍🍳',
                'hierarchy_level' => 2,
                'is_active' => true,
                'required_skills' => ['Culinary Arts', 'Kitchen Operations', 'Food Preparation', 'Team Management'],
            ],
            [
                'name' => 'Chef de Partie',
                'slug' => 'chef_de_partie',
                'description' => 'Station chef responsible for a specific area of the kitchen',
                'icon' => '🥘',
                'hierarchy_level' => 3,
                'is_active' => true,
                'required_skills' => ['Culinary Arts', 'Station Management', 'Food Preparation', 'Quality Control'],
            ],
            [
                'name' => 'Prep Cook',
                'slug' => 'prep_cook',
                'description' => 'Prepares ingredients and assists with basic food preparation',
                'icon' => '🔪',
                'hierarchy_level' => 4,
                'is_active' => true,
                'required_skills' => ['Food Preparation', 'Knife Skills', 'Food Safety', 'Kitchen Hygiene'],
            ],
            [
                'name' => 'Head Server',
                'slug' => 'head_server',
                'description' => 'Lead server who coordinates service and manages the dining experience',
                'icon' => '🍽️',
                'hierarchy_level' => 3,
                'is_active' => true,
                'required_skills' => ['Customer Service', 'Service Coordination', 'Wine Knowledge', 'Leadership'],
            ],
            [
                'name' => 'Server',
                'slug' => 'server',
                'description' => 'Provides table service and ensures guest satisfaction',
                'icon' => '🍷',
                'hierarchy_level' => 4,
                'is_active' => true,
                'required_skills' => ['Customer Service', 'Food Service', 'Communication', 'Attention to Detail'],
            ],
            [
                'name' => 'Kitchen Helper',
                'slug' => 'kitchen_helper',
                'description' => 'Assists with basic kitchen tasks and maintains cleanliness',
                'icon' => '🧹',
                'hierarchy_level' => 5,
                'is_active' => true,
                'required_skills' => ['Kitchen Hygiene', 'Basic Food Safety', 'Teamwork', 'Reliability'],
            ],
            [
                'name' => 'Bartender',
                'slug' => 'bartender',
                'description' => 'Prepares and serves beverages, manages bar operations',
                'icon' => '🍸',
                'hierarchy_level' => 4,
                'is_active' => true,
                'required_skills' => ['Mixology', 'Customer Service', 'Inventory Management', 'Food Safety'],
            ],
            [
                'name' => 'Dishwasher',
                'slug' => 'dishwasher',
                'description' => 'Maintains kitchen cleanliness and washes dishes',
                'icon' => '🧽',
                'hierarchy_level' => 6,
                'is_active' => true,
                'required_skills' => ['Kitchen Hygiene', 'Equipment Operation', 'Teamwork', 'Reliability'],
            ],
        ];

        foreach ($roles as $role) {
            CateringRole::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
