<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrainingHall;

class TrainingHallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $halls = [
            [
                'name' => 'مكانك اسكندرية',
                'code' => 'ALEX',
                'description' => 'Modern training facility in Alexandria with state-of-the-art equipment and multiple training rooms',
                'address' => 'Alexandria, Egypt',
                'city' => 'الإسكندرية',
                'capacity' => 50,
                'facilities' => [
                    'Computer Lab',
                    'Projector & Screen',
                    'Whiteboards',
                    'Air Conditioning',
                    'WiFi',
                    'Coffee Station',
                    'Parking'
                ],
                'contact_person' => 'Ahmed Hassan',
                'contact_phone' => '+20-3-1234-5678',
                'contact_email' => 'alexandria@yourplace.com',
                'assigned_employee_id' => null, // Will be assigned later
                'assigned_role' => null,
                'assignment_date' => null,
                'assignment_notes' => null,
                'specialized_courses' => [1, 2, 3], // Healthcare, Gas Turbines, Electronic Maintenance
                'is_general_purpose' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'مكانك مدينة نصر',
                'code' => 'NASR',
                'description' => 'Professional training center in Nasr City specializing in management and business courses',
                'address' => 'Nasr City, Cairo, Egypt',
                'city' => 'مدينة نصر',
                'capacity' => 40,
                'facilities' => [
                    'Conference Room',
                    'Presentation Equipment',
                    'Flip Charts',
                    'Air Conditioning',
                    'WiFi',
                    'Refreshments',
                    'Secure Parking'
                ],
                'contact_person' => 'Fatima Ali',
                'contact_phone' => '+20-2-9876-5432',
                'contact_email' => 'nasrcity@yourplace.com',
                'assigned_employee_id' => null, // Will be assigned later
                'assigned_role' => null,
                'assignment_date' => null,
                'assignment_notes' => null,
                'specialized_courses' => [4], // Resource Management
                'is_general_purpose' => false,
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($halls as $hall) {
            TrainingHall::create($hall);
        }
    }
}
