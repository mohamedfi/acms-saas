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
        Schema::create('hall_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_hall_id')->constrained('training_halls')->onDelete('cascade');
            $table->foreignId('training_program_id')->constrained('training_programs')->onDelete('cascade');
            $table->foreignId('trainer_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->date('start_date'); // First session date
            $table->date('end_date'); // Last session date
            $table->time('start_time'); // Session start time (e.g., 14:00)
            $table->time('end_time'); // Session end time (e.g., 17:00)
            $table->json('session_dates'); // Array of specific session dates
            $table->integer('max_participants')->default(30);
            $table->integer('current_participants')->default(0);
            $table->string('status')->default('scheduled'); // scheduled, in_progress, completed, cancelled
            $table->text('notes')->nullable();
            $table->decimal('price_per_participant', 10, 2)->nullable();
            $table->string('booking_reference')->unique(); // Unique booking reference
            $table->boolean('is_recurring')->default(false); // Weekly recurring sessions
            $table->json('recurring_pattern')->nullable(); // Days of week, frequency
            $table->timestamps();

            // Indexes for performance
            $table->index(['training_hall_id', 'start_date']);
            $table->index(['training_program_id', 'start_date']);
            $table->index(['start_date', 'end_date']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hall_bookings');
    }
};
