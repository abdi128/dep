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
        Schema::create('payment_options', function (Blueprint $table) {
            $table->id();
            $table->string('payment_method'); // e.g., "Commercial Bank of Ethiopia"
            $table->string('account_holder_name'); // e.g., "General Hospital"
            $table->string('account_number'); // e.g., "100020003000"
            $table->string('logo_path')->nullable(); // path to logo image
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_options');
    }
};
