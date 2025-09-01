<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Hassan',
                'full_name' => 'Ahmed Hassan',
                'email' => 'ahmed.hassan@yourplace.com',
                'phone' => '+20-3-1234-5678',
                'position' => 'Training Manager',
                'department' => 'Training',
                'is_active' => true,
                'hire_date' => '2024-01-15',
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Ali',
                'full_name' => 'Fatima Ali',
                'email' => 'fatima.ali@yourplace.com',
                'phone' => '+20-2-9876-5432',
                'position' => 'Training Coordinator',
                'department' => 'Training',
                'is_active' => true,
                'hire_date' => '2024-02-01',
            ],
            [
                'first_name' => 'Mohamed',
                'last_name' => 'El-Sayed',
                'full_name' => 'Mohamed El-Sayed',
                'email' => 'mohamed.elsayed@yourplace.com',
                'phone' => '+20-3-5555-1234',
                'position' => 'Training Supervisor',
                'department' => 'Training',
                'is_active' => true,
                'hire_date' => '2024-01-20',
            ],
            [
                'first_name' => 'Aisha',
                'last_name' => 'Mahmoud',
                'full_name' => 'Aisha Mahmoud',
                'email' => 'aisha.mahmoud@yourplace.com',
                'phone' => '+20-2-7777-8888',
                'position' => 'Training Assistant',
                'department' => 'Training',
                'is_active' => true,
                'hire_date' => '2024-03-01',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
