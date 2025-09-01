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
        Schema::create('company_vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_company_id')->constrained()->onDelete('cascade');
            
            // Vehicle Basic Information
            $table->string('vehicle_type'); // Sedan, SUV, Van, Bus, Luxury, etc.
            $table->string('brand');
            $table->string('model');
            $table->string('year', 4);
            $table->string('license_plate')->nullable();
            $table->string('color');
            $table->integer('seats');
            $table->string('fuel_type'); // Gasoline, Diesel, Electric, Hybrid
            $table->string('transmission'); // Automatic, Manual, CVT
            
            // Vehicle Specifications
            $table->string('engine_size')->nullable();
            $table->decimal('fuel_consumption', 5, 2)->nullable(); // L/100km or mpg
            $table->integer('mileage')->nullable(); // current mileage
            $table->json('features')->nullable(); // GPS, Bluetooth, etc.
            $table->text('description')->nullable();
            $table->json('images')->nullable(); // array of image URLs
            
            // Pricing Information
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->decimal('daily_rate', 8, 2);
            $table->decimal('weekly_rate', 8, 2)->nullable();
            $table->decimal('monthly_rate', 8, 2)->nullable();
            $table->decimal('weekend_rate', 8, 2)->nullable(); // special weekend pricing
            $table->decimal('holiday_rate', 8, 2)->nullable(); // special holiday pricing
            
            // Additional Charges
            $table->decimal('mileage_charge_per_km', 8, 2)->nullable(); // charge per km over limit
            $table->integer('included_mileage_per_day')->nullable(); // free km per day
            $table->decimal('driver_charge_per_hour', 8, 2)->nullable(); // if chauffeur service available
            $table->decimal('fuel_charge', 8, 2)->nullable(); // fuel service charge
            $table->decimal('cleaning_fee', 8, 2)->nullable();
            
            // Insurance & Deposits
            $table->decimal('insurance_daily_rate', 8, 2)->nullable();
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->boolean('insurance_included')->default(false);
            $table->text('insurance_coverage')->nullable();
            
            // Availability & Status
            $table->enum('status', ['available', 'rented', 'maintenance', 'out_of_service'])->default('available');
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_special_license')->default(false);
            $table->integer('minimum_age_requirement')->default(21);
            $table->integer('minimum_driving_experience')->default(1); // years
            
            // Location & Delivery
            $table->string('current_location')->nullable();
            $table->json('pickup_locations')->nullable(); // available pickup points
            $table->boolean('delivery_available')->default(false);
            $table->decimal('delivery_charge', 8, 2)->nullable();
            $table->integer('delivery_radius_km')->nullable();
            
            // Maintenance & Documentation
            $table->date('last_service_date')->nullable();
            $table->date('next_service_due')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('registration_expiry')->nullable();
            $table->text('maintenance_notes')->nullable();
            
            // Booking Rules
            $table->integer('minimum_rental_hours')->default(24);
            $table->integer('maximum_rental_days')->nullable();
            $table->json('blackout_dates')->nullable(); // dates when vehicle is not available
            $table->boolean('weekend_only')->default(false);
            $table->boolean('advance_booking_required')->default(false);
            $table->integer('advance_booking_hours')->nullable();
            
            // Performance Metrics
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->integer('total_bookings')->default(0);
            $table->integer('total_reviews')->default(0);
            $table->decimal('revenue_to_date', 12, 2)->default(0);
            
            // Metadata
            $table->json('additional_features')->nullable();
            $table->text('special_instructions')->nullable();
            $table->text('admin_notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['rental_company_id', 'status']);
            $table->index(['vehicle_type', 'is_active']);
            $table->index(['daily_rate', 'status']);
            $table->index('current_location');
            $table->unique(['rental_company_id', 'license_plate']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_vehicles');
    }
};