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
        Schema::create('catering_service_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catering_service_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('chef'); // chef, sous_chef, prep_cook, server, etc.
            $table->text('notes')->nullable(); // Additional notes about the assignment
            $table->boolean('is_primary')->default(false); // Primary employee for this service
            $table->boolean('is_available')->default(true); // Employee availability for this service
            $table->timestamps();

            // Prevent duplicate assignments with shorter constraint name
            $table->unique(['catering_service_id', 'employee_id', 'role'], 'catering_emp_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catering_service_employees');
    }
};
