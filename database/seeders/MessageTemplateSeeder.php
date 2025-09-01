<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\MessageTemplate;
use App\Models\User;

class MessageTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user as creator
        $user = User::first();
        if (!$user) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        $templates = [
            [
                'name' => 'Course Welcome',
                'description' => 'Welcome message for new course participants',
                'subject' => 'Welcome to {{course_name}} - PMEC Academy',
                'content' => "Dear {{participant_name}},\n\nWelcome to {{course_name}}! We're excited to have you join us.\n\nCourse Details:\n📚 Course: {{course_name}}\n📅 Start Date: {{course_start}}\n📅 End Date: {{course_end}}\n📍 Location: {{location}}\n\nPlease arrive 15 minutes before the start time. If you have any questions, don't hesitate to contact us.\n\nBest regards,\nPMEC Academy Team",
                'channel' => 'all',
                'category' => 'welcome',
                'variables' => ['participant_name', 'course_name', 'course_start', 'course_end', 'location'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'Course Reminder',
                'description' => 'Reminder for upcoming course sessions',
                'subject' => 'Reminder: {{course_name}} starts tomorrow',
                'content' => "Hi {{participant_name}},\n\nThis is a friendly reminder that {{course_name}} starts tomorrow at {{start_time}}.\n\nPlease ensure you:\n✅ Have all required materials\n✅ Arrive 15 minutes early\n✅ Bring your ID for registration\n\nLocation: {{location}}\n\nWe look forward to seeing you!\n\nBest regards,\nPMEC Academy Team",
                'channel' => 'all',
                'category' => 'reminder',
                'variables' => ['participant_name', 'course_name', 'start_time', 'location'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'Task Assignment',
                'description' => 'Notification for new task assignments',
                'subject' => 'New Task Assigned: {{task_title}}',
                'content' => "Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n📋 Task: {{task_title}}\n📝 Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n🔺 Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}",
                'channel' => 'all',
                'category' => 'task',
                'variables' => ['employee_name', 'task_title', 'task_description', 'due_date', 'priority', 'manager_name'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'Course Completion',
                'description' => 'Congratulations message for course completion',
                'subject' => 'Congratulations! You have completed {{course_name}}',
                'content' => "Dear {{participant_name}},\n\n🎉 Congratulations on successfully completing {{course_name}}!\n\nYour dedication and hard work have paid off. You should receive your certificate within the next 5-7 business days.\n\nWe hope you found the course valuable and look forward to seeing you in future programs.\n\nBest regards,\nPMEC Academy Team",
                'channel' => 'all',
                'category' => 'confirmation',
                'variables' => ['participant_name', 'course_name'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'General Announcement',
                'description' => 'General announcements and updates',
                'subject' => '{{announcement_title}}',
                'content' => "Dear Team,\n\n{{announcement_content}}\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\n{{sender_name}}",
                'channel' => 'all',
                'category' => 'announcement',
                'variables' => ['announcement_title', 'announcement_content', 'sender_name'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'Attendance Reminder',
                'description' => 'Reminder for course attendance',
                'subject' => 'Attendance Reminder: {{course_name}}',
                'content' => "Hi {{participant_name}},\n\nThis is a reminder that {{course_name}} is scheduled for {{session_date}} at {{session_time}}.\n\nPlease confirm your attendance by replying to this message or scanning the QR code at the venue.\n\nLocation: {{location}}\n\nWe look forward to seeing you!\n\nBest regards,\nPMEC Academy Team",
                'channel' => 'all',
                'category' => 'reminder',
                'variables' => ['participant_name', 'course_name', 'session_date', 'session_time', 'location'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
            [
                'name' => 'Emergency Notification',
                'description' => 'Emergency notifications and urgent updates',
                'subject' => 'URGENT: {{emergency_title}}',
                'content' => "🚨 EMERGENCY NOTIFICATION 🚨\n\n{{emergency_content}}\n\nPlease take immediate action as required.\n\nFor more information, contact: {{contact_info}}\n\nBest regards,\nEmergency Response Team",
                'channel' => 'all',
                'category' => 'announcement',
                'variables' => ['emergency_title', 'emergency_content', 'contact_info'],
                'is_active' => true,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ],
        ];

        foreach ($templates as $templateData) {
            MessageTemplate::updateOrCreate(
                ['name' => $templateData['name']],
                $templateData
            );
        }

        $this->command->info('Message templates seeded successfully!');
    }
}
