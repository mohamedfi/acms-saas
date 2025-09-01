<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Trainer;

class TrainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trainers = [
            [
                'full_name' => 'Dr. Ahmed Hassan',
                'email' => 'ahmed.hassan@pmec.com',
                'phone' => '+20 100 123 4567',
                'position' => 'Senior Training Consultant',
                'bio' => 'Expert in leadership development and organizational management with over 15 years of experience.',
                'expertise_areas' => 'Leadership, Management, Strategic Planning, Team Building',
                'qualifications' => 'PhD in Business Administration, MBA, Certified Professional Trainer',
                'years_experience' => 15,
                'status' => 'active',
                'hourly_rate' => 500.00,
                'currency' => 'EGP',
                'notes' => 'Specializes in executive training programs.',
            ],
            [
                'full_name' => 'Eng. Sarah Mahmoud',
                'email' => 'sarah.mahmoud@pmec.com',
                'phone' => '+20 100 234 5678',
                'position' => 'Technical Training Specialist',
                'bio' => 'Certified technical trainer with expertise in modern software development and IT management.',
                'expertise_areas' => 'Software Development, IT Management, Digital Transformation, Agile',
                'qualifications' => 'MSc in Computer Science, Certified Scrum Master, AWS Certified',
                'years_experience' => 12,
                'status' => 'active',
                'hourly_rate' => 450.00,
                'currency' => 'EGP',
                'notes' => 'Expert in modern software development methodologies.',
            ],
            [
                'full_name' => 'Prof. Omar Ali',
                'email' => 'omar.ali@pmec.com',
                'phone' => '+20 100 345 6789',
                'position' => 'Academic Training Director',
                'bio' => 'Professor with extensive experience in curriculum development and educational leadership.',
                'expertise_areas' => 'Curriculum Development, Educational Leadership, Research Methods, Assessment',
                'qualifications' => 'PhD in Education, Professor of Educational Leadership, Certified Curriculum Developer',
                'years_experience' => 20,
                'status' => 'active',
                'hourly_rate' => 600.00,
                'currency' => 'EGP',
                'notes' => 'Specializes in academic and research training programs.',
            ],
            [
                'full_name' => 'Ms. Fatima Khalil',
                'email' => 'fatima.khalil@pmec.com',
                'phone' => '+20 100 456 7890',
                'position' => 'Soft Skills Trainer',
                'bio' => 'Certified communication and soft skills trainer with international experience.',
                'expertise_areas' => 'Communication Skills, Presentation Skills, Customer Service, Team Building',
                'qualifications' => 'MA in Communication, Certified Professional Speaker, NLP Practitioner',
                'years_experience' => 10,
                'status' => 'active',
                'hourly_rate' => 400.00,
                'currency' => 'EGP',
                'notes' => 'Expert in interpersonal and communication skills development.',
            ],
        ];

        foreach ($trainers as $trainer) {
            Trainer::create($trainer);
        }
    }
}
