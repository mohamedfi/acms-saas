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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->string('course_name');
            $table->string('participant_name');
            $table->string('participant_email')->nullable();
            $table->string('company_name')->nullable();
            $table->date('completion_date');
            $table->date('issue_date');
            $table->text('description')->nullable();
            $table->string('background_image')->nullable();
            $table->json('custom_fields')->nullable(); // For additional custom data
            $table->string('status')->default('active'); // active, revoked, expired
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
