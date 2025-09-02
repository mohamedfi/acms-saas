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
        Schema::create('rental_car_prices', function (Blueprint $table) {
            $table->id();

            // Company and Vehicle Information
            $table->foreignId('rental_company_id')->constrained('rental_companies')->onDelete('cascade');
            $table->string('vehicle_type'); // Sedan, SUV, Van, etc.
            $table->integer('capacity'); // Number of seats/people

            // Route Information
            $table->string('from_location'); // Starting point
            $table->string('to_location'); // Destination
            $table->string('route_name')->nullable(); // Optional route name like "Airport → Dokki"

            // Pricing Information
            $table->decimal('price', 10, 2); // Price in AED
            $table->string('currency', 3)->default('AED');
            $table->string('price_type')->default('per_trip'); // per_trip, per_hour, per_day, per_km

            // Additional Information
            $table->text('description')->nullable();
            $table->json('additional_charges')->nullable(); // Extra charges like tolls, parking, etc.
            $table->boolean('is_active')->default(true);
            $table->boolean('is_available')->default(true);

            // Time-based pricing
            $table->time('valid_from_time')->nullable(); // Start time for this price
            $table->time('valid_to_time')->nullable(); // End time for this price
            $table->json('valid_days')->nullable(); // Days of week [1,2,3,4,5] for weekdays

            // Seasonal pricing
            $table->date('season_start_date')->nullable();
            $table->date('season_end_date')->nullable();

            // Admin fields
            $table->text('admin_notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();

            // Indexes for better performance
            $table->index(['rental_company_id', 'vehicle_type', 'capacity']);
            $table->index(['from_location', 'to_location']);
            $table->index(['is_active', 'is_available']);
            $table->index(['price_type']);

            // Unique constraint to prevent duplicate pricing (shortened for MySQL key length limit)
            $table->unique(['rental_company_id', 'vehicle_type', 'capacity', 'price_type'], 'unique_pricing_rule');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_car_prices');
    }
};
