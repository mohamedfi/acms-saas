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
        Schema::create('flight_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_instance_id')->constrained('course_instances')->onDelete('cascade');
            $table->foreignId('traveler_user_id')->nullable()->constrained('users');
            $table->string('airline');
            $table->string('flight_no')->nullable();
            $table->string('depart_airport');
            $table->string('arrive_airport');
            $table->datetime('depart_at');
            $table->datetime('return_at')->nullable();
            $table->decimal('cost', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['draft', 'booked', 'confirmed', 'canceled'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_bookings');
    }
};
