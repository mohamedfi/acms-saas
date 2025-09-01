<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Add new columns that don't exist
            $table->date('completed_date')->nullable()->after('due_date');
            $table->text('notes')->nullable()->after('completed_date');
            $table->foreignId('course_id')->nullable()->after('notes')->constrained('archived_courses')->onDelete('set null');
            $table->string('task_type')->default('general')->after('course_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop new columns
            $table->dropForeign(['assigned_to', 'assigned_by', 'course_id']);
            $table->dropColumn(['assigned_to', 'assigned_by', 'completed_date', 'notes', 'course_id', 'task_type']);

            // Revert column changes
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal')->change();
            $table->enum('status', ['pending', 'in_progress', 'done', 'blocked'])->default('pending')->change();
        });
    }
};
