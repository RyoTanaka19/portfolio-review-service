<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('portfolio_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // 未ログインユーザー対応
            $table->date('accessed_at'); // 日付単位で記録
            $table->timestamps();

            $table->unique(['portfolio_id', 'user_id', 'accessed_at']); // 1日1回のみ
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_accesses');
    }
};
