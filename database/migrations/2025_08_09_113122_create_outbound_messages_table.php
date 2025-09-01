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
        Schema::create('outbound_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_instance_id')->nullable()->constrained('course_instances')->onDelete('cascade');
            $table->foreignId('to_user_id')->nullable()->constrained('users');
            $table->string('to_phone')->nullable();
            $table->enum('channel', ['whatsapp', 'email', 'sms', 'chat']);
            $table->foreignId('template_id')->nullable()->constrained('message_templates');
            $table->json('payload');
            $table->enum('status', ['queued', 'sent', 'failed', 'delivered', 'read'])->default('queued');
            $table->string('provider_message_id')->nullable();
            $table->datetime('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outbound_messages');
    }
};
