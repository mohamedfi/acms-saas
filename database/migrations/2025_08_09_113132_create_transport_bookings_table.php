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
        Schema::create('transport_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_instance_id')->constrained('course_instances')->onDelete('cascade');
            $table->enum('type', ['taxi', 'shuttle', 'rental', 'rail', 'other']);
            $table->string('provider')->nullable();
            $table->string('pickup_at')->nullable();
            $table->string('dropoff_at')->nullable();
            $table->decimal('cost', 8, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['draft', 'booked', 'confirmed', 'canceled'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transport_bookings');
    }
};
