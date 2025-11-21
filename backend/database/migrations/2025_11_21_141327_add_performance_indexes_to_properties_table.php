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
            // Add index on created_at for faster sorting
            // Use try-catch to handle cases where index might already exist
            try {
                $table->index('created_at', 'properties_created_at_index');
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
            
            // Composite index for price and type (for filtering by price range and type)
            try {
                $table->index(['price', 'type'], 'properties_price_type_index');
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
            
            // Note: is_featured index already exists from previous migration
            // We don't add it here to avoid conflicts
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop indexes if they exist
            try {
                $table->dropIndex('properties_created_at_index');
            } catch (\Exception $e) {
                // Index might not exist, ignore
            }
            
            try {
                $table->dropIndex('properties_price_type_index');
            } catch (\Exception $e) {
                // Index might not exist, ignore
            }
            
            // Note: We don't drop is_featured index as it might be from previous migration
        });
    }
};
