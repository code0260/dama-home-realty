<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_conversions', function (Blueprint $table) {
            $table->id();
            $table->string('conversion_type'); // lead, booking, service_request, etc.
            $table->morphs('convertible'); // polymorphic relation
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id')->nullable();
            $table->string('source')->nullable(); // website, social_media, referral, etc.
            $table->string('medium')->nullable(); // organic, paid, email, etc.
            $table->string('campaign')->nullable();
            $table->decimal('value', 10, 2)->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();
            
            $table->index(['conversion_type', 'created_at']);
            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_conversions');
    }
};

