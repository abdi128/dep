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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            
            // Polymorphic relation to Appointment, LabTest, or Prescription
            $table->string('billable_type'); // e.g., "App\\Models\\Appointment"
            $table->unsignedBigInteger('billable_id'); 
            
            $table->decimal('amount', 10, 2); // e.g., 150.00 ETB
            $table->enum('status', ['Not Paid', 'Paid', 'Verified', 'Invalid'])->default('Not Paid');
            $table->foreignId('payment_option_id')->nullable()->constrained()->nullOnDelete();
            $table->string('payment_proof_path')->nullable(); // path to payment proof image
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
