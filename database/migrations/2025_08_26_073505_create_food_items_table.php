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
        Schema::create('food_items', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Pizza", "Burger", "Salad"
            $table->text('description')->nullable();
            $table->string('category'); // e.g., "Main Course", "Appetizer", "Dessert", "Beverage"
            $table->string('cuisine_type')->nullable(); // e.g., "Italian", "American", "Arabic"
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->boolean('is_halal')->default(false);
            $table->boolean('is_gluten_free')->default(false);
            $table->text('allergen_info')->nullable();
            $table->text('ingredients')->nullable();
            $table->text('nutritional_info')->nullable();
            $table->integer('preparation_time_minutes')->nullable();
            $table->string('serving_temperature')->nullable(); // "Hot", "Cold", "Room Temperature"
            $table->string('image_path')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            // Indexes
            $table->index(['category', 'is_available']);
            $table->index('cuisine_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_items');
    }
};
