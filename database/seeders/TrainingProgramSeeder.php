<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrainingProgram;

class TrainingProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'name' => 'الرعاية الصحية',
                'code' => 'HC001',
                'description' => 'Comprehensive healthcare training program covering medical procedures, patient care, and healthcare management',
                'duration_hours' => 120,
                'total_sessions' => 8,
                'price_per_session' => 150.00,
                'category' => 'Healthcare',
                'level' => 'Intermediate',
                'prerequisites' => ['Basic medical knowledge', 'Healthcare certification'],
                'learning_objectives' => ['Patient care procedures', 'Medical equipment operation', 'Safety protocols'],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'توربينات الغاز',
                'code' => 'GT002',
                'description' => 'Advanced training in gas turbine operation, maintenance, and engineering principles',
                'duration_hours' => 80,
                'total_sessions' => 5,
                'price_per_session' => 200.00,
                'category' => 'Engineering',
                'level' => 'Advanced',
                'prerequisites' => ['Engineering background', 'Mechanical knowledge'],
                'learning_objectives' => ['Turbine operation', 'Maintenance procedures', 'Safety protocols'],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'الصيانة الاليكترونية',
                'code' => 'EM003',
                'description' => 'Electronic equipment maintenance, troubleshooting, and repair techniques',
                'duration_hours' => 100,
                'total_sessions' => 12,
                'price_per_session' => 180.00,
                'category' => 'Electronics',
                'level' => 'Intermediate',
                'prerequisites' => ['Basic electronics', 'Technical skills'],
                'learning_objectives' => ['Circuit troubleshooting', 'Component replacement', 'Testing procedures'],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'إدارة الموارد',
                'code' => 'RM004',
                'description' => 'Strategic resource planning, allocation, and optimization for organizations',
                'duration_hours' => 60,
                'total_sessions' => 6,
                'price_per_session' => 175.00,
                'category' => 'Management',
                'level' => 'Beginner',
                'prerequisites' => ['Basic management concepts'],
                'learning_objectives' => ['Resource planning', 'Optimization techniques', 'Cost management'],
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($programs as $program) {
            TrainingProgram::create($program);
        }
    }
}
