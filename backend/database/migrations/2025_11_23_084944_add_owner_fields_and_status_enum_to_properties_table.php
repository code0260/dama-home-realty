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
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('active', 'sold', 'rented', 'pending', 'draft') DEFAULT 'pending'");
        
        // Update default status for existing records to 'pending' if they are 'active'
        DB::table('properties')
            ->where('status', 'active')
            ->update(['status' => 'pending']);
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
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('active', 'sold', 'rented') DEFAULT 'active'");
        
        // Convert 'pending' and 'draft' back to 'active' before dropping the enum values
        DB::table('properties')
            ->whereIn('status', ['pending', 'draft'])
            ->update(['status' => 'active']);
    }
};
