<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Information Technology',
                'description' => 'IT infrastructure, software development, and technical support',
                'code' => 'IT',
                'is_active' => true,
                'sort_order' => 1,
                'budget' => 500000.00,
                'location' => 'Main Building, 2nd Floor',
                'contact_email' => 'it@pmec.com',
                'contact_phone' => '+20-2-1234-5678',
            ],
            [
                'name' => 'Training & Development',
                'description' => 'Employee training, skill development, and learning programs',
                'code' => 'T&D',
                'is_active' => true,
                'sort_order' => 2,
                'budget' => 300000.00,
                'location' => 'Training Building, 1st Floor',
                'contact_email' => 'training@pmec.com',
                'contact_phone' => '+20-2-1234-5679',
            ],
            [
                'name' => 'Finance & Accounting',
                'description' => 'Financial management, accounting, and budget control',
                'code' => 'FIN',
                'is_active' => true,
                'sort_order' => 3,
                'budget' => 200000.00,
                'location' => 'Main Building, 1st Floor',
                'contact_email' => 'finance@pmec.com',
                'contact_phone' => '+20-2-1234-5680',
            ],
            [
                'name' => 'Operations',
                'description' => 'Day-to-day operations, process management, and efficiency',
                'code' => 'OPS',
                'is_active' => true,
                'sort_order' => 4,
                'budget' => 400000.00,
                'location' => 'Main Building, Ground Floor',
                'contact_email' => 'operations@pmec.com',
                'contact_phone' => '+20-2-1234-5681',
            ],
            [
                'name' => 'Human Resources',
                'description' => 'Employee relations, recruitment, and HR policies',
                'code' => 'HR',
                'is_active' => true,
                'sort_order' => 5,
                'budget' => 150000.00,
                'location' => 'Main Building, 1st Floor',
                'contact_email' => 'hr@pmec.com',
                'contact_phone' => '+20-2-1234-5682',
            ],
            [
                'name' => 'Marketing & Sales',
                'description' => 'Marketing strategies, sales operations, and customer relations',
                'code' => 'MKT',
                'is_active' => true,
                'sort_order' => 6,
                'budget' => 250000.00,
                'location' => 'Main Building, 2nd Floor',
                'contact_email' => 'marketing@pmec.com',
                'contact_phone' => '+20-2-1234-5683',
            ],
            [
                'name' => 'Customer Support',
                'description' => 'Customer service, technical support, and client relations',
                'code' => 'CS',
                'is_active' => true,
                'sort_order' => 7,
                'budget' => 180000.00,
                'location' => 'Main Building, Ground Floor',
                'contact_email' => 'support@pmec.com',
                'contact_phone' => '+20-2-1234-5684',
            ],
            [
                'name' => 'Research & Development',
                'description' => 'Innovation, product development, and research initiatives',
                'code' => 'R&D',
                'is_active' => true,
                'sort_order' => 8,
                'budget' => 600000.00,
                'location' => 'Research Building, All Floors',
                'contact_email' => 'rd@pmec.com',
                'contact_phone' => '+20-2-1234-5685',
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }

        $this->command->info('Departments seeded successfully!');
    }
}
