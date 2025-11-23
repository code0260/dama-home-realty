<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type'); // page_view, property_view, booking_created, etc.
            $table->string('event_name');
            $table->morphs('eventable'); // polymorphic relation
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->json('properties')->nullable(); // Additional event data
            $table->string('session_id')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamps();
            
            $table->index(['event_type', 'created_at']);
            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};

