<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // レビュー投稿者
            $table->foreignId('portfolio_id')->constrained()->onDelete('cascade'); // 対象ポートフォリオ
            $table->tinyInteger('rating'); // 1~5評価
            $table->text('comment')->nullable(); // コメント
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
