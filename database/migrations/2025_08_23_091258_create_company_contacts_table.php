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
        Schema::create('company_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_company_id')->constrained()->onDelete('cascade');
            
            // Contact Information
            $table->string('name');
            $table->string('title')->nullable(); // Manager, Sales Rep, Customer Service, etc.
            $table->string('department')->nullable(); // Sales, Support, Fleet Management, etc.
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('direct_line')->nullable();
            $table->string('extension')->nullable();
            
            // Contact Type & Specialization
            $table->enum('contact_type', [
                'primary', 
                'sales', 
                'support', 
                'billing', 
                'emergency', 
                'fleet_manager', 
                'maintenance',
                'insurance'
            ])->default('primary');
            
            $table->json('specializations')->nullable(); // e.g., ["luxury_vehicles", "commercial_fleet", "long_term_rentals"]
            $table->json('languages_spoken')->nullable(); // e.g., ["English", "Arabic", "French"]
            
            // Availability
            $table->json('working_hours')->nullable(); // e.g., {"monday": "08:00-18:00", "tuesday": "08:00-18:00"}
            $table->string('timezone')->nullable();
            $table->boolean('available_weekends')->default(false);
            $table->boolean('available_holidays')->default(false);
            $table->boolean('emergency_contact')->default(false);
            
            // Contact Preferences
            $table->json('preferred_contact_methods')->nullable(); // e.g., ["email", "phone", "whatsapp"]
            $table->enum('preferred_language', ['English', 'Arabic', 'French', 'Spanish', 'Other'])->default('English');
            $table->text('notes')->nullable();
            
            // Location Information
            $table->string('office_location')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            
            // Status & Priority
            $table->boolean('is_active')->default(true);
            $table->boolean('is_primary')->default(false);
            $table->integer('priority_level')->default(1); // 1 = highest priority, 5 = lowest
            
            // Performance & Metrics
            $table->decimal('response_time_hours', 5, 2)->nullable(); // average response time
            $table->decimal('customer_rating', 3, 2)->nullable(); // customer satisfaction rating
            $table->integer('total_interactions')->default(0);
            $table->timestamp('last_contact_date')->nullable();
            
            // Social & Professional
            $table->string('linkedin')->nullable();
            $table->string('skype')->nullable();
            $table->string('teams')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['rental_company_id', 'contact_type']);
            $table->index(['rental_company_id', 'is_active', 'is_primary']);
            $table->index('emergency_contact');
            $table->index(['city', 'region']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_contacts');
    }
};