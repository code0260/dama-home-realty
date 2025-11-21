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
        Schema::table('properties', function (Blueprint $table) {
            $table->string('wifi_password')->nullable()->after('video_url');
            $table->string('door_code')->nullable()->after('wifi_password');
            $table->text('house_rules')->nullable()->after('door_code');
            $table->text('full_address')->nullable()->after('house_rules');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['wifi_password', 'door_code', 'house_rules', 'full_address']);
        });
    }
};
