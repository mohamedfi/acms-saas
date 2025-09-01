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
        Schema::table('roles', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
            $table->string('color', 20)->nullable()->after('sort_order');
            $table->string('icon', 50)->nullable()->after('color');
            $table->integer('access_level')->default(1)->after('icon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn(['sort_order', 'color', 'icon', 'access_level']);
        });
    }
};
