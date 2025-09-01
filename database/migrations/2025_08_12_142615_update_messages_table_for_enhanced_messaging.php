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
        if (Schema::hasTable('messages')) {
            Schema::table('messages', function (Blueprint $table) {
                if (!Schema::hasColumn('messages', 'from_user_id')) {
                    $table->foreignId('from_user_id')->nullable()->after('to_user_id')->constrained('users');
                }
                if (!Schema::hasColumn('messages', 'course_instance_id')) {
                    $table->foreignId('course_instance_id')->nullable()->after('from_user_id')->constrained('course_instances');
                }
                if (!Schema::hasColumn('messages', 'message_type')) {
                    $table->enum('message_type', ['notification', 'reminder', 'alert', 'confirmation'])->default('notification')->after('message_text');
                }
                if (!Schema::hasColumn('messages', 'channel')) {
                    $table->enum('channel', ['whatsapp', 'sms', 'email'])->default('whatsapp')->after('message_type');
                }
                if (!Schema::hasColumn('messages', 'scheduled_at')) {
                    $table->timestamp('scheduled_at')->nullable()->after('status');
                }
                if (!Schema::hasColumn('messages', 'sent_at')) {
                    $table->timestamp('sent_at')->nullable()->after('scheduled_at');
                }
                if (!Schema::hasColumn('messages', 'delivery_status')) {
                    $table->enum('delivery_status', ['pending', 'delivered', 'failed'])->default('pending')->after('sent_at');
                }
                if (!Schema::hasColumn('messages', 'delivery_response')) {
                    $table->json('delivery_response')->nullable()->after('delivery_status');
                }
                if (!Schema::hasColumn('messages', 'template_used')) {
                    $table->string('template_used')->nullable()->after('delivery_response');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['from_user_id']);
            $table->dropForeign(['course_instance_id']);
            $table->dropColumn([
                'from_user_id',
                'course_instance_id',
                'message_type',
                'channel',
                'scheduled_at',
                'sent_at',
                'delivery_status',
                'delivery_response',
                'template_used'
            ]);
        });
    }
};
