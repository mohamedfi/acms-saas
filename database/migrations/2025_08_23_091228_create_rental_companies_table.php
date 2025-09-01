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
        Schema::create('rental_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->json('business_hours')->nullable(); // e.g., {"monday": "08:00-18:00", "tuesday": "08:00-18:00"}
            
            // Contact Information
            $table->string('primary_email')->nullable();
            $table->string('primary_phone')->nullable();
            $table->string('website')->nullable();
            
            // Address Information
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            
            // Business Information
            $table->string('registration_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_expiry')->nullable();
            
            // Service Information
            $table->json('services_offered')->nullable(); // e.g., ["car_rental", "bus_rental", "chauffeur_service"]
            $table->json('coverage_areas')->nullable(); // e.g., ["Dubai", "Abu Dhabi", "Sharjah"]
            $table->decimal('minimum_rental_hours', 8, 2)->default(24.00);
            $table->boolean('offers_insurance')->default(true);
            $table->boolean('offers_delivery')->default(false);
            $table->decimal('delivery_fee', 8, 2)->nullable();
            
            // Financial Information
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->json('payment_methods')->nullable(); // e.g., ["cash", "card", "bank_transfer"]
            $table->string('currency', 3)->default('AED');
            $table->decimal('cancellation_fee', 8, 2)->nullable();
            $table->integer('cancellation_hours')->nullable(); // hours before rental to cancel without fee
            
            // Contract & Terms
            $table->text('terms_and_conditions')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->text('damage_policy')->nullable();
            
            // Rating & Status
            $table->decimal('rating', 3, 2)->nullable(); // 0.00 to 5.00
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            
            // Metadata
            $table->json('additional_info')->nullable(); // for any extra fields
            $table->text('internal_notes')->nullable(); // for admin use
            
            $table->timestamps();
            
            // Indexes
            $table->index(['is_active', 'is_verified']);
            $table->index(['city', 'state']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_companies');
    }
};