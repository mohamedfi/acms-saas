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
        Schema::create('meal_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('duration', ['daily', 'weekly', 'monthly']);
            $table->integer('duration_value')->default(1); // e.g., 7 for weekly
            $table->decimal('total_price', 10, 2);
            $table->decimal('price_per_day', 8, 2)->nullable();
            $table->boolean('includes_breakfast')->default(false);
            $table->boolean('includes_lunch')->default(false);
            $table->boolean('includes_dinner')->default(false);
            $table->boolean('includes_snacks')->default(false);
            $table->boolean('includes_beverages')->default(false);
            $table->text('special_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_plans');
    }
};
