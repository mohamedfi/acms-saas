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
        Schema::create('catering_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "Chef", "Sous Chef", "Server"
            $table->string('slug')->unique(); // e.g., "chef", "sous_chef", "server"
            $table->text('description')->nullable(); // Description of responsibilities
            $table->string('icon')->nullable(); // Emoji or icon representation
            $table->integer('hierarchy_level')->default(0); // For ordering roles by importance
            $table->boolean('is_active')->default(true); // Whether this role is available
            $table->json('required_skills')->nullable(); // Skills needed for this role
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catering_roles');
    }
};
