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
        Schema::create('dietary_requirements', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Vegetarian', 'Vegan', 'Gluten-Free'
            $table->text('description')->nullable();
            $table->enum('category', ['dietary_restriction', 'allergy', 'preference', 'religious']);
            $table->text('restrictions')->nullable(); // What foods are restricted
            $table->text('allowed_foods')->nullable(); // What foods are allowed
            $table->text('substitutions')->nullable(); // Alternative food suggestions
            $table->boolean('requires_medical_attention')->default(false);
            $table->text('medical_notes')->nullable();
            $table->string('icon')->nullable(); // Emoji or icon representation
            $table->string('color')->nullable(); // Color coding for UI
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dietary_requirements');
    }
};
