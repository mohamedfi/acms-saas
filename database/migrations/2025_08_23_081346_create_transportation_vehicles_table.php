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
        Schema::create('transportation_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_type'); // Sedan, SUV, Van, Bus, Luxury, etc.
            $table->string('brand'); // Toyota, Mercedes, BMW, etc.
            $table->string('model'); // Camry, S-Class, X5, etc.
            $table->string('year'); // 2023, 2024, etc.
            $table->string('license_plate')->unique();
            $table->string('color');
            $table->integer('seats'); // Number of passenger seats
            $table->string('fuel_type'); // Gasoline, Diesel, Electric, Hybrid
            $table->string('transmission'); // Manual, Automatic
            $table->text('features')->nullable(); // JSON: GPS, AC, Bluetooth, etc.
            $table->text('description')->nullable();
            $table->decimal('daily_rate', 10, 2); // Daily rental rate
            $table->decimal('hourly_rate', 10, 2)->nullable(); // Hourly rate if applicable
            $table->decimal('weekly_rate', 10, 2)->nullable(); // Weekly rate if applicable
            $table->decimal('monthly_rate', 10, 2)->nullable(); // Monthly rate if applicable
            $table->string('status')->default('available'); // available, rented, maintenance, out_of_service
            $table->string('location')->nullable(); // Current location/garage
            $table->string('insurance_info')->nullable();
            $table->date('last_maintenance')->nullable();
            $table->date('next_maintenance')->nullable();
            $table->integer('mileage')->default(0);
            $table->text('maintenance_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transportation_vehicles');
    }
};
