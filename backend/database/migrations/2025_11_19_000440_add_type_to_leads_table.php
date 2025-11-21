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
        Schema::table('leads', function (Blueprint $table) {
            $table->string('type')->nullable()->after('message')->default('inquiry'); // inquiry, live_tour_request, service_request
            $table->string('preferred_date')->nullable()->after('type');
            $table->string('preferred_time')->nullable()->after('preferred_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['type', 'preferred_date', 'preferred_time']);
        });
    }
};
