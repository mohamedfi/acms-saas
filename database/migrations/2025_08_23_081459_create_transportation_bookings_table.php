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
        Schema::create('transportation_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('transportation_vehicles')->onDelete('cascade');
            $table->string('booking_reference')->unique(); // Auto-generated reference
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('customer_id_type')->nullable(); // Passport, Driver's License, etc.
            $table->string('customer_id_number')->nullable();
            $table->string('customer_address')->nullable();
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->datetime('pickup_datetime');
            $table->datetime('dropoff_datetime');
            $table->integer('duration_hours'); // Calculated duration
            $table->integer('duration_days'); // Calculated duration
            $table->decimal('total_amount', 10, 2); // Calculated total
            $table->string('payment_status')->default('pending'); // pending, paid, refunded
            $table->string('booking_status')->default('confirmed'); // confirmed, active, completed, cancelled
            $table->text('special_requests')->nullable();
            $table->text('notes')->nullable();
            $table->string('driver_name')->nullable(); // If driver is provided
            $table->string('driver_phone')->nullable();
            $table->string('driver_license')->nullable();
            $table->decimal('fuel_charge', 10, 2)->default(0);
            $table->decimal('insurance_charge', 10, 2)->default(0);
            $table->decimal('additional_charges', 10, 2)->default(0);
            $table->text('damage_report')->nullable();
            $table->decimal('damage_charges', 10, 2)->default(0);
            $table->datetime('actual_pickup_datetime')->nullable();
            $table->datetime('actual_dropoff_datetime')->nullable();
            $table->integer('actual_mileage')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transportation_bookings');
    }
};
