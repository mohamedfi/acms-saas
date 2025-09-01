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
        Schema::create('catering_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['breakfast', 'lunch', 'dinner', 'snack', 'beverage']);
            $table->decimal('price_per_person', 8, 2);
            $table->string('cuisine_type')->nullable(); // e.g., 'Italian', 'Arabic', 'International'
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->boolean('is_halal')->default(false);
            $table->boolean('is_gluten_free')->default(false);
            $table->integer('preparation_time_minutes')->default(30);
            $table->integer('serving_temperature')->nullable(); // in Celsius
            $table->string('allergen_info')->nullable();
            $table->text('ingredients')->nullable();
            $table->text('nutritional_info')->nullable();
            $table->boolean('is_available')->default(true);
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catering_services');
    }
};
