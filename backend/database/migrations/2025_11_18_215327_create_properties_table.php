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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('slug')->unique();
            $table->json('title'); // Translatable: {en: "...", ar: "..."}
            $table->json('description'); // Translatable: {en: "...", ar: "..."}
            $table->decimal('price', 12, 2);
            $table->enum('currency', ['USD', 'SYP'])->default('USD');
            $table->enum('type', ['rent', 'sale', 'hotel']);
            $table->foreignId('neighborhood_id')
                ->nullable()
                ->constrained('neighborhoods')
                ->cascadeOnDelete();
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('area_sqm');
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->string('video_url')->nullable();
            $table->string('owner_contact');
            $table->enum('status', ['active', 'sold', 'rented'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
