<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Participant;

class AdditionalParticipantsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participants = [
            [
                'full_name' => 'Dr. Mariam El-Sayed',
                'email' => 'mariam.elsayed@techcorp.com',
                'phone' => '+20 10 1234 5678',
                'organization' => 'TechCorp Egypt',
                'passport_no' => 'EG123456789',
                'nationality' => 'Egyptian',
                'notes' => 'Expert in AI and machine learning. Senior Software Engineer in Engineering department.',
                'visa_status' => 'not_required',
            ],
            [
                'full_name' => 'Eng. Khalid Al-Rashid',
                'email' => 'khalid.alrashid@innovate.ae',
                'phone' => '+971 50 9876 5432',
                'organization' => 'Innovate Solutions UAE',
                'passport_no' => 'AE987654321',
                'nationality' => 'Emirati',
                'notes' => 'Specializes in digital transformation projects. Project Manager in Project Management department.',
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Ms. Leila Ben Ali',
                'email' => 'leila.benali@medtech.tn',
                'phone' => '+216 71 234 567',
                'organization' => 'MedTech Tunisia',
                'passport_no' => 'TN456789123',
                'nationality' => 'Tunisian',
                'notes' => 'Expert in healthcare technology implementation. Healthcare Consultant in Healthcare Solutions department.',
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Prof. Ahmed Mansour',
                'email' => 'ahmed.mansour@university.edu.sa',
                'phone' => '+966 50 123 4567',
                'organization' => 'King Fahd University',
                'passport_no' => 'SA789123456',
                'nationality' => 'Saudi',
                'notes' => 'Research focus on cybersecurity and blockchain. Professor of Computer Science in Computer Science department.',
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Eng. Fatima Zahra',
                'email' => 'fatima.zahra@smartcity.ma',
                'phone' => '+212 6 12 34 56 78',
                'organization' => 'Smart City Morocco',
                'passport_no' => 'MA321654987',
                'nationality' => 'Moroccan',
                'notes' => 'Specializes in IoT and smart infrastructure. Smart City Architect in Urban Planning department.',
                'visa_status' => 'required',
            ],
            [
                'full_name' => 'Dr. Omar Hassan',
                'email' => 'omar.hassan@fintech.jo',
                'phone' => '+962 79 876 5432',
                'organization' => 'FinTech Jordan',
                'passport_no' => 'JO654321987',
                'nationality' => 'Jordanian',
                'notes' => 'Expert in blockchain and digital banking. Financial Technology Director in Technology department.',
                'visa_status' => 'required',
            ],
        ];

        foreach ($participants as $participantData) {
            // Check if participant already exists by email
            if (!Participant::where('email', $participantData['email'])->exists()) {
                // Generate unique QR code for each participant
                $participantData['qr_code'] = Participant::generateQrCode();

                Participant::create($participantData);
                echo "✅ Added participant: " . $participantData['full_name'] . " (QR: " . $participantData['qr_code'] . ")" . PHP_EOL;
            } else {
                echo "⚠️  Participant already exists: " . $participantData['full_name'] . PHP_EOL;
            }
        }

        echo PHP_EOL . "🎯 Total participants now: " . Participant::count() . PHP_EOL;
    }
}
