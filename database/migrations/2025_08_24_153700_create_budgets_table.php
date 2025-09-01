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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('period', ['monthly', 'quarterly', 'yearly']);
            $table->year('fiscal_year');
            $table->string('period_name')->nullable(); // e.g., "Q1", "January", etc.

            // Foreign Keys
            $table->foreignId('category_id')->nullable()->constrained('financial_categories')->onDelete('restrict');

            $table->decimal('budgeted_amount', 15, 2);
            $table->decimal('actual_amount', 15, 2)->default(0);
            $table->decimal('variance', 15, 2)->default(0);
            $table->decimal('variance_percentage', 5, 2)->default(0);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes
            $table->index(['fiscal_year', 'period']);
            $table->index(['category_id', 'fiscal_year', 'period', 'period_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
