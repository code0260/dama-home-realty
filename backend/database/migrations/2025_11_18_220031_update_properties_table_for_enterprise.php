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
        // This migration is now handled in the create_properties_table migration
        // Keeping this file for reference but it's no longer needed
        // If you have existing data, you would need to migrate it manually
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('title')->change();
            $table->text('description')->change();
            $table->dropForeign(['neighborhood_id']);
            $table->dropColumn(['neighborhood_id', 'slug', 'video_url', 'is_featured']);
            $table->string('location_area')->after('type');
        });
    }
};
