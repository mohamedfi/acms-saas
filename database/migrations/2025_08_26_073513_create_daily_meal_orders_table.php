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
        Schema::create('daily_meal_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_break_plan_id')->constrained('meal_break_plans')->onDelete('cascade');
            $table->date('order_date'); // e.g., 2025-08-15
            $table->string('day_name'); // e.g., "Monday", "Tuesday"
            $table->string('course_name'); // e.g., "Project Management", "Skills Development"
            $table->integer('number_of_attendance'); // Total people for this course on this day
            $table->string('location'); // e.g., "Alexandria", "Nasr City", "BDC", "Business Square"
            $table->decimal('delivery_cost', 10, 2)->default(0); // Delivery cost for this day/location
            $table->decimal('total_food_cost', 10, 2)->default(0); // Sum of all food items for this day
            $table->decimal('daily_total', 10, 2)->default(0); // Food cost + delivery for this day
            $table->text('special_instructions')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'in_preparation', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();

            // Indexes
            $table->index(['meal_break_plan_id', 'order_date']);
            $table->index('location');
            $table->index('course_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_meal_orders');
    }
};
