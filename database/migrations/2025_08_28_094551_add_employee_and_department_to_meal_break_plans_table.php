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
        Schema::table('meal_break_plans', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            // Add indexes for better performance
            $table->index('employee_id');
            $table->index('department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meal_break_plans', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['department_id']);
            $table->dropIndex(['employee_id']);
            $table->dropIndex(['department_id']);
            $table->dropColumn(['employee_id', 'department_id']);
        });
    }
};
