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
        Schema::create('training_halls', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "مكانك اسكندرية", "مكانك مدينة نصر"
            $table->string('code')->unique(); // e.g., "ALEX", "NASR"
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('city'); // e.g., "الإسكندرية", "القاهرة"
            $table->integer('capacity')->default(30); // Maximum participants
            $table->json('facilities')->nullable(); // Available equipment, amenities
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
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
        Schema::dropIfExists('training_halls');
    }
};
