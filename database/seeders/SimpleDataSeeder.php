<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Participant;
use App\Models\Trainer;

class SimpleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "Starting to add courses and participants...\n";

        // Get existing trainers
        $trainers = Trainer::all();

        if ($trainers->count() < 2) {
            echo "❌ Need at least 2 trainers to create courses\n";
            return;
        }

        // Add 3 courses
        $courses = [
            [
                'name' => 'Advanced Project Management Professional (PMP)',
                'code' => 'PMP-001',
                'description' => 'Comprehensive project management course covering PMBOK methodology, risk management, stakeholder engagement, and advanced project planning techniques.',
                'delivery_type' => 'office',
                'country' => 'Egypt',
                'city' => 'Cairo',
                'trainer_id' => $trainers[0]->id,
                'coordinator_id' => $trainers[1]->id,
            ],
            [
                'name' => 'Strategic Leadership & Change Management',
                'code' => 'SLCM-002',
                'description' => 'Advanced leadership course focusing on strategic thinking, organizational change management, team building, and executive decision-making skills.',
                'delivery_type' => 'offsite',
                'country' => 'Egypt',
                'city' => 'Alexandria',
                'trainer_id' => $trainers[1]->id,
                'coordinator_id' => $trainers[0]->id,
            ],
            [
                'name' => 'Digital Transformation & Innovation Management',
                'code' => 'DTIM-003',
                'description' => 'Cutting-edge course on digital transformation strategies, innovation management, emerging technologies, and organizational agility.',
                'delivery_type' => 'abroad',
                'country' => 'UAE',
                'city' => 'Dubai',
                'trainer_id' => $trainers[0]->id,
                'coordinator_id' => $trainers[1]->id,
            ],
        ];

        $coursesAdded = 0;
        foreach ($courses as $courseData) {
            if (!Course::where('code', $courseData['code'])->exists()) {
                Course::create($courseData);
                $coursesAdded++;
            }
        }

        // Add 5 participants
        $participants = [
            [
                'full_name' => 'Ahmed Hassan El-Masry',
                'email' => 'ahmed.hassan@egyptsoft.com',
                'phone' => '+20 10 1234 5678',
                'organization' => 'Egypt Soft Solutions',
                'passport_no' => 'A12345678',
                'nationality' => 'Egyptian',
                'notes' => 'Senior Project Manager with 8 years experience in IT projects',
                'qr_code' => 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'visa_status' => 'not_required',
            ],
            [
                'full_name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@globaltech.com',
                'phone' => '+1 555 123 4567',
                'organization' => 'Global Tech Solutions',
                'passport_no' => 'US98765432',
                'nationality' => 'American',
                'notes' => 'Director of Operations, interested in digital transformation',
                'qr_code' => 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Mohammed Al-Rashid',
                'email' => 'm.alrashid@saudiconsulting.com',
                'phone' => '+966 50 987 6543',
                'organization' => 'Saudi Consulting Group',
                'passport_no' => 'SA45678901',
                'nationality' => 'Saudi',
                'notes' => 'Strategic Planning Manager, focus on leadership development',
                'qr_code' => 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Fatima Zahra Benali',
                'email' => 'f.benali@moroccotech.ma',
                'phone' => '+212 6 123 45678',
                'organization' => 'Morocco Tech Innovations',
                'passport_no' => 'MA78901234',
                'nationality' => 'Moroccan',
                'notes' => 'Innovation Manager, expertise in emerging technologies',
                'qr_code' => 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Omar Khalil',
                'email' => 'omar.khalil@qatarventures.qa',
                'phone' => '+974 3 456 7890',
                'organization' => 'Qatar Ventures',
                'passport_no' => 'QA56789012',
                'nationality' => 'Qatari',
                'notes' => 'Business Development Director, strategic leadership focus',
                'qr_code' => 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'visa_status' => 'required',
            ],
        ];

        $participantsAdded = 0;
        foreach ($participants as $participantData) {
            if (!Participant::where('email', $participantData['email'])->exists()) {
                Participant::create($participantData);
                $participantsAdded++;
            }
        }

        echo "✅ Successfully added {$coursesAdded} new courses\n";
        echo "✅ Successfully added {$participantsAdded} new participants\n";
        echo "✅ Database seeding completed!\n";
    }
}
