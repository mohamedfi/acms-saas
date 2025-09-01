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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_type'); // email, phone, whatsapp
            $table->string('recipient_value'); // email address or phone number
            $table->string('recipient_name')->nullable(); // display name
            $table->string('subject')->nullable(); // for email
            $table->text('content');
            $table->enum('channel', ['email', 'sms', 'whatsapp', 'in_app'])->default('email');
            $table->enum('status', ['pending', 'sent', 'delivered', 'failed'])->default('pending');
            $table->foreignId('template_id')->nullable()->constrained('message_templates')->onDelete('set null');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('scheduled_at')->nullable(); // for scheduled messages
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->json('metadata')->nullable(); // API responses, etc.
            $table->decimal('cost', 8, 4)->default(0); // message cost
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('category', ['course', 'task', 'announcement', 'reminder', 'welcome', 'confirmation'])->default('announcement');
            $table->string('related_type')->nullable(); // polymorphic relationship
            $table->unsignedBigInteger('related_id')->nullable(); // polymorphic relationship
            $table->timestamps();

            // Indexes
            $table->index(['recipient_type', 'recipient_value']);
            $table->index(['channel', 'status']);
            $table->index(['category', 'status']);
            $table->index(['scheduled_at', 'status']);
            $table->index(['related_type', 'related_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
