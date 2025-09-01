<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archived_courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_name');
            $table->string('course_code')->nullable();
            $table->text('description')->nullable();
            $table->string('trainer_name');
            $table->string('coordinator_name');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration_hours');
            $table->string('delivery_type'); // office, offsite, abroad
            $table->string('location_details')->nullable();
            $table->integer('total_participants');
            $table->integer('successful_participants');
            $table->decimal('completion_rate', 5, 2); // percentage
            $table->text('trainer_notes')->nullable();
            $table->text('coordinator_notes')->nullable();
            $table->string('status')->default('archived'); // archived, completed
            $table->date('archived_date');
            $table->timestamps();
        });

        // Course sections table for the detailed requirements
        Schema::create('archived_course_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archived_course_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('section_name_en'); // English name
            $table->string('section_name_ar'); // Arabic name
            $table->string('type'); // File upload, Survey/Upload, Integrated table, Form/table, Gallery upload, Auto-generated/upload, Input/table
            $table->text('description');
            $table->integer('order'); // Section order
            $table->boolean('is_required')->default(true);
            $table->boolean('is_completed')->default(false);
            $table->text('completion_notes')->nullable();
            $table->timestamps();
        });

        // Course section files table
        Schema::create('archived_course_section_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archived_course_section_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size');
            $table->text('description')->nullable();
            $table->string('uploaded_by');
            $table->timestamps();
        });

        // Course participants archive
        Schema::create('archived_course_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archived_course_id')->constrained()->onDelete('cascade');
            $table->string('participant_name');
            $table->string('participant_email');
            $table->string('participant_phone')->nullable();
            $table->string('organization')->nullable();
            $table->string('nationality')->nullable();
            $table->string('passport_no')->nullable();
            $table->enum('attendance_status', ['present', 'absent', 'late'])->default('present');
            $table->decimal('evaluation_score', 5, 2)->nullable(); // 0.00 to 100.00
            $table->text('evaluation_feedback')->nullable();
            $table->boolean('certificate_issued')->default(false);
            $table->date('certificate_issue_date')->nullable();
            $table->timestamps();
        });

        // Course finances
        Schema::create('archived_course_finances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('archived_course_id')->constrained()->onDelete('cascade');
            $table->string('expense_type'); // trainer_fees, travel, printing, per_diem, materials, other
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('EGP');
            $table->text('description')->nullable();
            $table->string('approved_by')->nullable();
            $table->date('approval_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_course_finances');
        Schema::dropIfExists('archived_course_participants');
        Schema::dropIfExists('archived_course_section_files');
        Schema::dropIfExists('archived_course_sections');
        Schema::dropIfExists('archived_courses');
    }
};
