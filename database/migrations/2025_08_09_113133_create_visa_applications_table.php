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
        Schema::create('visa_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_instance_id')->constrained('course_instances')->onDelete('cascade');
            $table->foreignId('traveler_user_id')->nullable()->constrained('users');
            $table->string('destination_country');
            $table->string('application_no')->nullable();
            $table->datetime('submitted_at')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'denied'])->default('draft');
            $table->decimal('fee', 8, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visa_applications');
    }
};
