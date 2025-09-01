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
        Schema::create('food_item_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('food_item_id')->constrained('food_items')->onDelete('cascade');
            $table->string('location'); // e.g., "Alexandria", "Nasr City", "BDC", "Business Square", "Dokki"
            $table->decimal('price', 10, 2); // Price for this food item at this location
            $table->decimal('delivery_cost', 10, 2)->default(0); // Delivery cost to this location
            $table->boolean('is_available')->default(true);
            $table->text('location_notes')->nullable(); // Special notes for this location
            $table->timestamps();

            // Unique constraint: one price per food item per location
            $table->unique(['food_item_id', 'location']);

            // Indexes
            $table->index('location');
            $table->index('is_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_item_locations');
    }
};
