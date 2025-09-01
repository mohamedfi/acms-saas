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
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_instance_id')->constrained('course_instances')->onDelete('cascade');
            $table->foreignId('guest_user_id')->nullable()->constrained('users');
            $table->string('hotel_name');
            $table->text('address')->nullable();
            $table->date('checkin');
            $table->date('checkout');
            $table->decimal('nightly_rate', 8, 2);
            $table->decimal('taxes', 8, 2)->default(0);
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
        Schema::dropIfExists('hotel_bookings');
    }
};
