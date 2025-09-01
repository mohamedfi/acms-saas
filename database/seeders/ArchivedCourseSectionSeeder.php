<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArchivedCourseSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'section_name_en' => 'Passports',
                'section_name_ar' => 'باسبورات',
                'type' => 'File upload',
                'description' => 'Upload scanned passport copies of participants',
                'order' => 1,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Course Material',
                'section_name_ar' => 'مادة علمية',
                'type' => 'File upload',
                'description' => 'PDFs, PPTs, Word documents, etc.',
                'order' => 2,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Evaluations',
                'section_name_ar' => 'تقييمات',
                'type' => 'Survey/Upload',
                'description' => 'Forms or documents with participant feedback',
                'order' => 3,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Attendance',
                'section_name_ar' => 'حضور',
                'type' => 'Integrated table',
                'description' => 'Integrated with attendance sheet (checkbox/QR/manual input)',
                'order' => 4,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Participants Data',
                'section_name_ar' => 'بيانات المشاركين',
                'type' => 'Form/table',
                'description' => 'Name, job title, phone, email, etc.',
                'order' => 5,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Photos',
                'section_name_ar' => 'صور',
                'type' => 'Gallery upload',
                'description' => 'Upload session photos with captions',
                'order' => 6,
                'is_required' => false,
            ],
            [
                'section_name_en' => 'Certificates',
                'section_name_ar' => 'شهادات',
                'type' => 'Auto-generated/upload',
                'description' => 'Upload or auto-generate with template & participant names',
                'order' => 7,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Official Letters',
                'section_name_ar' => 'خطابات الاسناد والموافقة',
                'type' => 'File upload',
                'description' => 'Upload ministry/entity approval letters',
                'order' => 8,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Trainer CV',
                'section_name_ar' => 'السيرة الذاتية للمدرب',
                'type' => 'File upload',
                'description' => 'Upload CV or trainer profile document',
                'order' => 9,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Report',
                'section_name_ar' => 'التقرير',
                'type' => 'Upload or generate',
                'description' => 'End-of-course summary report, trainer notes, etc.',
                'order' => 10,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Finance',
                'section_name_ar' => 'المالية',
                'type' => 'Input/table',
                'description' => 'Trainer fees, travel, printing, per diem, etc.',
                'order' => 11,
                'is_required' => true,
            ],
            [
                'section_name_en' => 'Thank You Notes',
                'section_name_ar' => 'كلمات شكر',
                'type' => 'Upload',
                'description' => 'Scanned letters from clients/trainees',
                'order' => 12,
                'is_required' => false,
            ],
        ];

        foreach ($sections as $section) {
            DB::table('archived_course_sections')->insert($section);
        }
    }
}
