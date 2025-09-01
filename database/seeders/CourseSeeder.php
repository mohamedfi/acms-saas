<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Trainer;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing trainers or create new ones if needed
        $trainers = Trainer::all();

        if ($trainers->count() < 3) {
            // Create additional trainers if needed
            $additionalTrainers = Trainer::factory(3 - $trainers->count())->create();
            $trainers = $trainers->merge($additionalTrainers);
        }

        // Ensure we have at least 3 trainers
        $trainers = $trainers->take(3);

        // Get existing course locations
        $locations = \App\Models\CourseLocation::all();
        if ($locations->isEmpty()) {
            $this->command->warn('No course locations found. Please run CourseLocationSeeder first.');
            return;
        }

        $courses = [
            [
                'name' => 'Advanced Project Management Professional (PMP)',
                'code' => 'PMP-001',
                'description' => 'Comprehensive project management course covering PMBOK methodology, risk management, stakeholder engagement, and advanced project planning techniques. This course prepares participants for PMP certification.',
                'delivery_type' => 'office',
                'country' => 'Egypt',
                'city' => 'Cairo',
                'trainer_id' => $trainers[0]->id,
                'coordinator_id' => $trainers[1]->id,
            ],
            [
                'name' => 'Strategic Leadership & Change Management',
                'code' => 'SLCM-002',
                'description' => 'Advanced leadership course focusing on strategic thinking, organizational change management, team building, and executive decision-making skills for senior managers and directors.',
                'delivery_type' => 'offsite',
                'country' => 'Egypt',
                'city' => 'Alexandria',
                'trainer_id' => $trainers[1]->id,
                'coordinator_id' => $trainers[2]->id,
            ],
            [
                'name' => 'Digital Transformation & Innovation Management',
                'code' => 'DTIM-003',
                'description' => 'Cutting-edge course on digital transformation strategies, innovation management, emerging technologies, and organizational agility in the digital age.',
                'delivery_type' => 'abroad',
                'country' => 'UAE',
                'city' => 'Dubai',
                'trainer_id' => $trainers[2]->id,
                'coordinator_id' => $trainers[0]->id,
            ],
        ];

        foreach ($courses as $courseData) {
            // Check if course already exists
            if (!Course::where('code', $courseData['code'])->exists()) {
                Course::create($courseData);
            }
        }

        $this->command->info('3 courses have been created successfully!');
    }
}
