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
        Schema::create('appointment_pricings', function (Blueprint $table) {
            $table->id();
            $table->integer('min_minutes'); // e.g., 0, 60, 120
            $table->integer('max_minutes'); // e.g., 60, 120, 180
            $table->decimal('price', 10, 2); // e.g., 100.00 ETB
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_pricings');
    }
};
