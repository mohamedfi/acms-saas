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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique(); // Unique asset identifier
            $table->string('name');
            $table->text('description')->nullable();

            // Category and Location (temporarily as integers, will add foreign keys later)
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('location_id');

            // Asset Details
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('condition')->default('good'); // excellent, good, fair, poor, damaged

            // Financial Information
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('supplier')->nullable();
            $table->string('warranty_expiry')->nullable();

            // Status and Tracking
            $table->enum('status', ['available', 'in_use', 'maintenance', 'retired', 'lost'])->default('available');
            $table->string('assigned_to')->nullable(); // Who is currently using it
            $table->text('notes')->nullable();

            // QR Code and Images
            $table->string('qr_code')->nullable();
            $table->json('images')->nullable(); // Array of image paths

            // Maintenance
            $table->date('last_maintenance')->nullable();
            $table->date('next_maintenance')->nullable();
            $table->text('maintenance_notes')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['category_id', 'status']);
            $table->index(['location_id', 'status']);
            $table->index('asset_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
