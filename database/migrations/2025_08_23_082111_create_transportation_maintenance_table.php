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
        Schema::create('transportation_maintenance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('transportation_vehicles')->onDelete('cascade');
            $table->string('maintenance_type'); // routine, repair, inspection, emergency
            $table->string('title'); // Oil change, Brake repair, etc.
            $table->text('description')->nullable();
            $table->date('maintenance_date');
            $table->date('next_maintenance_date')->nullable();
            $table->decimal('cost', 10, 2);
            $table->string('mechanic_name')->nullable();
            $table->string('mechanic_phone')->nullable();
            $table->string('garage_name')->nullable();
            $table->string('garage_address')->nullable();
            $table->text('work_performed')->nullable();
            $table->text('parts_replaced')->nullable();
            $table->integer('mileage_at_service');
            $table->string('status')->default('completed'); // scheduled, in_progress, completed, cancelled
            $table->text('notes')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('warranty_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transportation_maintenance');
    }
};
