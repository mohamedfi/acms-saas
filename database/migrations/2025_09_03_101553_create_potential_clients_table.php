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
        Schema::create('potential_clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->string('industry')->nullable();
            $table->string('country')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost'])->default('new');
            $table->enum('source', ['website', 'referral', 'social_media', 'cold_call', 'email_campaign', 'event', 'other'])->default('website');
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->date('last_contact_date')->nullable();
            $table->date('next_follow_up')->nullable();
            $table->string('assigned_to')->nullable(); // User ID or name
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('potential_clients');
    }
};
