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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->enum('type', ['income', 'expense', 'transfer']);
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('USD');
            $table->date('transaction_date');
            $table->string('description');
            $table->text('notes')->nullable();

            // Foreign Keys
            $table->foreignId('account_id')->nullable()->constrained()->onDelete('restrict');
            $table->foreignId('category_id')->nullable()->constrained('financial_categories')->onDelete('restrict');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Related business entities
            $table->string('related_type')->nullable(); // 'course', 'catering', 'logistics', 'asset', etc.
            $table->unsignedBigInteger('related_id')->nullable(); // ID of the related entity

            $table->string('status')->default('completed'); // pending, completed, cancelled
            $table->json('metadata')->nullable(); // Additional data
            $table->timestamps();

            // Indexes
            $table->index(['related_type', 'related_id']);
            $table->index(['transaction_date', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
