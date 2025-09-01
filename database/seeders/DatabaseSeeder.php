<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            EmployeeSeeder::class,
            TaskSeeder::class,
            TrainerSeeder::class,
            CourseSeeder::class,
            ParticipantSeeder::class,
            MealBreakPlanSeeder::class,
            DepartmentSeeder::class,
            CourseLocationSeeder::class,
        ]);

        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@pmec.com')->exists()) {
            User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@pmec.com',
                'role_id' => 1, // admin role
            ]);
        }
    }
}
