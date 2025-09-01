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
        Schema::create('meal_break_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "August 2025 Meal Break Plan"
            $table->text('description')->nullable();
            $table->date('start_date'); // e.g., 2025-08-15
            $table->date('end_date'); // e.g., 2025-08-19
            $table->integer('total_days'); // 5 days
            $table->decimal('total_delivery_cost', 10, 2)->default(0); // Total delivery costs for period
            $table->decimal('total_food_cost', 10, 2)->default(0); // Total food costs for period
            $table->decimal('grand_total', 10, 2)->default(0); // Total food + delivery for period
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['start_date', 'end_date']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_break_plans');
    }
};
