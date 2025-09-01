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
        Schema::create('meal_break_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_break_plan_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('cost', 10, 2);
            $table->decimal('delivery_cost', 10, 2)->default(0);
            $table->string('location')->nullable();
            $table->string('department')->nullable();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->string('supplier')->nullable();
            $table->string('day');
            $table->decimal('total', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_break_plan_items');
    }
};
