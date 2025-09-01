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
        Schema::table('message_templates', function (Blueprint $table) {
            // Add new columns
            $table->text('description')->nullable()->after('name');
            $table->string('subject')->nullable()->after('description');
            
            // Rename body to content
            $table->renameColumn('body', 'content');
            
            // Update channel enum to include 'all'
            $table->enum('channel', ['email', 'sms', 'whatsapp', 'all'])->default('all')->change();
            
            // Add new columns
            $table->enum('category', ['course', 'task', 'announcement', 'reminder', 'welcome', 'confirmation'])->default('announcement')->after('channel');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade')->after('is_active');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null')->after('created_by');
            
            // Rename active to is_active
            $table->renameColumn('active', 'is_active');
            
            // Drop the old key column as we'll use name as unique identifier
            $table->dropColumn('key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('message_templates', function (Blueprint $table) {
            // Revert changes
            $table->dropForeign(['created_by', 'updated_by']);
            $table->dropColumn(['description', 'subject', 'category', 'created_by', 'updated_by']);
            $table->renameColumn('content', 'body');
            $table->renameColumn('is_active', 'active');
            $table->enum('channel', ['whatsapp', 'email', 'sms', 'chat'])->change();
            $table->string('key')->unique()->after('id');
        });
    }
};
