<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system access and control',
                'permissions' => json_encode(['all']),
                'is_active' => true,
                'sort_order' => 1,
                'color' => 'bg-red-500',
                'icon' => '👑',
                'access_level' => 10,
            ],
            [
                'name' => 'coordinator',
                'display_name' => 'Course Coordinator',
                'description' => 'Manages course operations and logistics',
                'permissions' => json_encode(['courses', 'participants', 'tasks']),
                'is_active' => true,
                'sort_order' => 2,
                'color' => 'bg-orange-500',
                'icon' => '🎯',
                'access_level' => 5,
            ],
            [
                'name' => 'trainer',
                'display_name' => 'Course Trainer',
                'description' => 'Delivers training and manages course content',
                'permissions' => json_encode(['courses', 'materials', 'evaluations']),
                'is_active' => true,
                'sort_order' => 3,
                'color' => 'bg-green-500',
                'icon' => '🎓',
                'access_level' => 3,
            ],
            [
                'name' => 'finance',
                'display_name' => 'Finance Manager',
                'description' => 'Handles financial operations and reporting',
                'permissions' => json_encode(['finance', 'reports']),
                'is_active' => true,
                'sort_order' => 4,
                'color' => 'bg-yellow-500',
                'icon' => '💰',
                'access_level' => 5,
            ],
            [
                'name' => 'support',
                'display_name' => 'Support Staff',
                'description' => 'Provides administrative and logistical support',
                'permissions' => json_encode(['tasks', 'support']),
                'is_active' => true,
                'sort_order' => 5,
                'color' => 'bg-blue-500',
                'icon' => '🔧',
                'access_level' => 2,
            ],
            [
                'name' => 'manager',
                'display_name' => 'Department Manager',
                'description' => 'Manages department operations and team leadership',
                'permissions' => json_encode(['employees', 'tasks', 'reports', 'departments']),
                'is_active' => true,
                'sort_order' => 6,
                'color' => 'bg-purple-500',
                'icon' => '👨‍💼',
                'access_level' => 7,
            ],
            [
                'name' => 'analyst',
                'display_name' => 'Data Analyst',
                'description' => 'Analyzes data and generates reports',
                'permissions' => json_encode(['reports', 'analytics', 'data']),
                'is_active' => true,
                'sort_order' => 7,
                'color' => 'bg-teal-500',
                'icon' => '📊',
                'access_level' => 4,
            ],
            [
                'name' => 'assistant',
                'display_name' => 'Executive Assistant',
                'description' => 'Provides high-level administrative support',
                'permissions' => json_encode(['tasks', 'scheduling', 'communications']),
                'is_active' => true,
                'sort_order' => 8,
                'color' => 'bg-pink-500',
                'icon' => '💼',
                'access_level' => 3,
            ],
        ];

        foreach ($roles as $role) {
            $existingRole = DB::table('roles')->where('name', $role['name'])->first();

            if ($existingRole) {
                // Update existing role
                DB::table('roles')
                    ->where('name', $role['name'])
                    ->update([
                        'display_name' => $role['display_name'],
                        'description' => $role['description'],
                        'permissions' => $role['permissions'],
                        'is_active' => $role['is_active'],
                        'sort_order' => $role['sort_order'],
                        'color' => $role['color'],
                        'icon' => $role['icon'],
                        'access_level' => $role['access_level'],
                        'updated_at' => now()
                    ]);
            } else {
                // Insert new role
                DB::table('roles')->insert([
                    'name' => $role['name'],
                    'display_name' => $role['display_name'],
                    'description' => $role['description'],
                    'permissions' => $role['permissions'],
                    'is_active' => $role['is_active'],
                    'sort_order' => $role['sort_order'],
                    'color' => $role['color'],
                    'icon' => $role['icon'],
                    'access_level' => $role['access_level'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
