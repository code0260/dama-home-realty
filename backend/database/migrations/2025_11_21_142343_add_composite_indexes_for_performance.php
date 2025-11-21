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
        // Add composite index for properties: is_featured + created_at
        // This optimizes the common query: orderBy('is_featured', 'desc')->orderBy('created_at', 'desc')
        Schema::table('properties', function (Blueprint $table) {
            try {
                $table->index(['is_featured', 'created_at'], 'properties_featured_created_index');
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        });

        // Add composite index for articles: is_featured + published_at
        // This optimizes the common query: orderBy('published_at', 'desc') with featured filter
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                try {
                    $table->index(['is_featured', 'published_at'], 'articles_featured_published_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            try {
                $table->dropIndex('properties_featured_created_index');
            } catch (\Exception $e) {
                // Index might not exist, ignore
            }
        });

        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                try {
                    $table->dropIndex('articles_featured_published_index');
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            });
        }
    }
};
