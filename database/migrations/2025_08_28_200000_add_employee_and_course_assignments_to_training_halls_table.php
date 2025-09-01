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
        Schema::table('training_halls', function (Blueprint $table) {
            // Add employee assignment fields
            $table->unsignedBigInteger('assigned_employee_id')->nullable()->after('contact_email');
            $table->string('assigned_role')->nullable()->after('assigned_employee_id'); // e.g., 'manager', 'coordinator', 'supervisor'
            $table->date('assignment_date')->nullable()->after('assigned_role');
            $table->text('assignment_notes')->nullable()->after('assignment_date');
            
            // Add course relationship fields
            $table->json('specialized_courses')->nullable()->after('assignment_notes'); // Array of course IDs this hall specializes in
            $table->boolean('is_general_purpose')->default(true)->after('specialized_courses'); // Can host any course or only specialized ones
            
            // Add foreign key constraint
            $table->foreign('assigned_employee_id')->references('id')->on('employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_halls', function (Blueprint $table) {
            $table->dropForeign(['assigned_employee_id']);
            $table->dropColumn([
                'assigned_employee_id',
                'assigned_role',
                'assignment_date',
                'assignment_notes',
                'specialized_courses',
                'is_general_purpose'
            ]);
        });
    }
};
