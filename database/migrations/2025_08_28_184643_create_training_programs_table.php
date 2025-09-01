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
        Schema::create('training_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "الرعاية الصحية", "توربينات الغاز"
            $table->string('code')->unique(); // e.g., "HC", "GT"
            $table->text('description')->nullable();
            $table->integer('duration_hours')->default(3); // Session duration in hours
            $table->integer('total_sessions')->default(1); // Total number of sessions
            $table->decimal('price_per_session', 10, 2)->nullable(); // Price per session
            $table->string('category')->nullable(); // e.g., "Technical", "Management"
            $table->string('level')->nullable(); // e.g., "Beginner", "Intermediate", "Advanced"
            $table->json('prerequisites')->nullable(); // Required skills/knowledge
            $table->json('learning_objectives')->nullable(); // What participants will learn
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_programs');
    }
};
