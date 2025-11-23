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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->string('contract_number')->unique();
            $table->enum('status', ['draft', 'active', 'expired', 'cancelled'])->default('active');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'refunded'])->default('pending');
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->string('pdf_path')->nullable(); // Path to generated PDF contract
            $table->boolean('signed_by_tenant')->default(false);
            $table->boolean('signed_by_owner')->default(false);
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['booking_id']);
            $table->index(['status']);
            $table->index(['contract_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
