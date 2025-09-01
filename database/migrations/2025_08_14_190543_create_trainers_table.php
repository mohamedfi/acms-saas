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
        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('position')->nullable(); // Senior Trainer, Lead Instructor, etc.
            $table->text('bio')->nullable(); // Professional background
            $table->text('expertise_areas')->nullable(); // JSON or text of expertise
            $table->string('qualifications')->nullable(); // Degrees, certifications
            $table->integer('years_experience')->default(0);
            $table->string('profile_image')->nullable();
            $table->string('cv_document')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->string('currency')->default('EGP');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainers');
    }
};
