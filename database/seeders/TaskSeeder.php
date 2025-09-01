<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get employee IDs
        $coordinator = DB::table('employees')->where('employee_id', 'EMP002')->first();
        $trainer = DB::table('employees')->where('employee_id', 'EMP003')->first();
        $support = DB::table('employees')->where('employee_id', 'EMP005')->first();

        // Get course ID (assuming we have at least one archived course)
        $course = DB::table('archived_courses')->first();

        $tasks = [
            [
                'title' => 'Prepare PMO1 Course Materials',
                'description' => 'Review and update all training materials for the upcoming PMO1 course',
                'assigned_to' => $trainer->id,
                'assigned_by' => $coordinator->id,
                'priority' => 'high',
                'status' => 'in_progress',
                'due_date' => now()->addDays(7),
                'task_type' => 'course-related',
                'course_id' => $course ? $course->id : null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Update Participant Database',
                'description' => 'Clean and update the participant database with latest information',
                'assigned_to' => $support->id,
                'assigned_by' => $coordinator->id,
                'priority' => 'normal',
                'status' => 'pending',
                'due_date' => now()->addDays(3),
                'task_type' => 'administrative',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Review Course Evaluations',
                'description' => 'Analyze feedback from recent PMO1 course participants',
                'assigned_to' => $trainer->id,
                'assigned_by' => $coordinator->id,
                'priority' => 'normal',
                'status' => 'pending',
                'due_date' => now()->addDays(5),
                'task_type' => 'course-related',
                'course_id' => $course ? $course->id : null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Prepare Financial Report',
                'description' => 'Generate monthly financial report for training operations',
                'assigned_to' => $support->id,
                'assigned_by' => $coordinator->id,
                'priority' => 'high',
                'status' => 'pending',
                'due_date' => now()->addDays(2),
                'task_type' => 'financial',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        foreach ($tasks as $task) {
            // Remove any null values that might cause issues
            $taskData = array_filter($task, function($value) {
                return $value !== null;
            });
            
            DB::table('tasks')->insert($taskData);
        }
    }
}
