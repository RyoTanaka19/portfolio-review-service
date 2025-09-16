<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('portfolio_accesses', 'accesses');
    }

    public function down(): void
    {
        Schema::rename('accesses', 'portfolio_accesses');
    }
};
