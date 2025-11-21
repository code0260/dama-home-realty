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
        // Properties table indexes
        if (Schema::hasTable('properties')) {
            Schema::table('properties', function (Blueprint $table) {
                try { $table->index('type'); } catch (\Exception $e) {}
                try { $table->index('status'); } catch (\Exception $e) {}
                try { $table->index('is_featured'); } catch (\Exception $e) {}
                try { $table->index('is_verified'); } catch (\Exception $e) {}
                try { $table->index('neighborhood_id'); } catch (\Exception $e) {}
                try { $table->index('agent_id'); } catch (\Exception $e) {}
                try { $table->index(['status', 'type']); } catch (\Exception $e) {}
                try { $table->index(['is_featured', 'status']); } catch (\Exception $e) {}
                try { $table->index('price'); } catch (\Exception $e) {}
            });
        }

        // Bookings table indexes (skip user_id, booking_status, and composite index as they exist in create migration)
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {
                try { $table->index('property_id'); } catch (\Exception $e) {}
                try { $table->index('payment_status'); } catch (\Exception $e) {}
                try { $table->index(['user_id', 'booking_status']); } catch (\Exception $e) {}
            });
        }

        // Leads table indexes
        if (Schema::hasTable('leads')) {
            Schema::table('leads', function (Blueprint $table) {
                try { $table->index('property_id'); } catch (\Exception $e) {}
                try { $table->index('status'); } catch (\Exception $e) {}
                try { $table->index('type'); } catch (\Exception $e) {}
                try { $table->index('created_at'); } catch (\Exception $e) {}
            });
        }

        // Articles table indexes
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                try { $table->index('slug'); } catch (\Exception $e) {}
                try { $table->index('published_at'); } catch (\Exception $e) {}
                try { $table->index('is_featured'); } catch (\Exception $e) {}
                try { $table->index('author_id'); } catch (\Exception $e) {}
            });
        }

        // Neighborhoods table indexes
        if (Schema::hasTable('neighborhoods')) {
            Schema::table('neighborhoods', function (Blueprint $table) {
                try { $table->index('slug'); } catch (\Exception $e) {}
                try { $table->index('city'); } catch (\Exception $e) {}
            });
        }

        // Users table indexes (if not already exists)
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'email')) {
                    $table->index('email');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Properties table indexes
        if (Schema::hasTable('properties')) {
            Schema::table('properties', function (Blueprint $table) {
                try {
                    $table->dropIndex(['type']);
                    $table->dropIndex(['status']);
                    $table->dropIndex(['is_featured']);
                    $table->dropIndex(['is_verified']);
                    $table->dropIndex(['neighborhood_id']);
                    $table->dropIndex(['agent_id']);
                    $table->dropIndex(['status', 'type']);
                    $table->dropIndex(['is_featured', 'status']);
                    $table->dropIndex(['price']);
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }

        // Bookings table indexes
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {
                try {
                    $table->dropIndex(['property_id']);
                    $table->dropIndex(['user_id']);
                    $table->dropIndex(['booking_status']);
                    $table->dropIndex(['payment_status']);
                    $table->dropIndex(['property_id', 'check_in', 'check_out']);
                    $table->dropIndex(['user_id', 'booking_status']);
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }

        // Leads table indexes
        if (Schema::hasTable('leads')) {
            Schema::table('leads', function (Blueprint $table) {
                try {
                    $table->dropIndex(['property_id']);
                    $table->dropIndex(['status']);
                    $table->dropIndex(['type']);
                    $table->dropIndex(['created_at']);
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }

        // Articles table indexes
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                try {
                    $table->dropIndex(['slug']);
                    $table->dropIndex(['published_at']);
                    $table->dropIndex(['is_featured']);
                    $table->dropIndex(['author_id']);
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }

        // Neighborhoods table indexes
        if (Schema::hasTable('neighborhoods')) {
            Schema::table('neighborhoods', function (Blueprint $table) {
                try {
                    $table->dropIndex(['slug']);
                    $table->dropIndex(['city']);
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }
    }
};

