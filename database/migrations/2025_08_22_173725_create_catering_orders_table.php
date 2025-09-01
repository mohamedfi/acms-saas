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
        Schema::create('catering_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('course_id')->nullable()->constrained('archived_courses')->onDelete('set null');
            $table->string('event_name')->nullable();
            $table->date('event_date');
            $table->time('event_time');
            $table->integer('expected_attendees');
            $table->integer('confirmed_attendees')->default(0);
            $table->enum('status', ['pending', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'])->default('pending');
            $table->enum('delivery_type', ['pickup', 'delivery', 'on_site'])->default('delivery');
            $table->text('delivery_address')->nullable();
            $table->text('special_instructions')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('tax_amount', 8, 2)->default(0);
            $table->decimal('discount_amount', 8, 2)->default(0);
            $table->decimal('final_amount', 10, 2);
            $table->string('payment_status')->default('pending');
            $table->string('payment_method')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->foreignId('ordered_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catering_orders');
    }
};
