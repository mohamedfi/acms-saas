<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Participant;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participants = [
            [
                'full_name' => 'Ahmed Hassan El-Masry',
                'email' => 'ahmed.hassan@egyptsoft.com',
                'phone' => '+20 10 1234 5678',
                'organization' => 'Egypt Soft Solutions',
                'passport_no' => 'A12345678',
                'nationality' => 'Egyptian',
                'notes' => 'Senior Project Manager with 8 years experience in IT projects',
                'qr_code' => Participant::generateQrCode(),
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
                'qr_code' => Participant::generateQrCode(),
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
                'qr_code' => Participant::generateQrCode(),
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
                'qr_code' => Participant::generateQrCode(),
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
                'qr_code' => Participant::generateQrCode(),
                'visa_status' => 'required',
            ],
        ];

        foreach ($participants as $participantData) {
            // Check if participant already exists
            if (!Participant::where('email', $participantData['email'])->exists()) {
                Participant::create($participantData);
            }
        }

        $this->command->info('5 participants have been created successfully!');
    }
}
