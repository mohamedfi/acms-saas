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
        Schema::create('individual_food_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_meal_order_id')->constrained('daily_meal_orders')->onDelete('cascade');
            $table->foreignId('food_item_id')->constrained('food_items');
            $table->string('customer_name')->nullable(); // Optional: specific person's name
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2); // Price for this food item at this location
            $table->decimal('total_price', 10, 2); // quantity * unit_price
            $table->text('special_instructions')->nullable(); // e.g., "no onions", "extra cheese"
            $table->enum('status', ['ordered', 'confirmed', 'in_preparation', 'ready', 'delivered'])->default('ordered');
            $table->timestamps();

            // Indexes
            $table->index(['daily_meal_order_id', 'food_item_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('individual_food_orders');
    }
};
