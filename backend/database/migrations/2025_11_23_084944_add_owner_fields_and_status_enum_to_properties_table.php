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
        Schema::table('properties', function (Blueprint $table) {
            // Add owner_name and owner_email fields
            $table->string('owner_name')->nullable()->after('owner_contact');
            $table->string('owner_email')->nullable()->after('owner_name');
        });

        // Update status enum to include 'pending' and 'draft'
        // MySQL doesn't support ALTER ENUM directly, so we need to use raw SQL
        // Note: Keeping default as 'active' to preserve existing behavior and avoid hiding live properties
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('active', 'sold', 'rented', 'pending', 'draft') DEFAULT 'active'");
        
        // Removed: Force-updating existing 'active' records to 'pending' is dangerous in production
        // Existing records will keep their current status, and new records will default to 'active'
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['owner_name', 'owner_email']);
        });

        // Revert status enum to original values
        // Note: Converting 'pending' and 'draft' records to 'active' to avoid data loss
        // This is safer than leaving them in an invalid state
        DB::table('properties')
            ->whereIn('status', ['pending', 'draft'])
            ->update(['status' => 'active']);
        
        // Revert enum after data conversion to avoid constraint violations
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('active', 'sold', 'rented') DEFAULT 'active'");
    }
};
