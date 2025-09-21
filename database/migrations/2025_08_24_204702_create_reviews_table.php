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

            // レビュー投稿者
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 対象ポートフォリオ
            $table->foreignId('portfolio_id')->constrained()->onDelete('cascade');

            // 総合評価（小数対応、nullable）
            $table->decimal('rating', 3, 1)->nullable();

            // 詳細評価（nullable、1~5の評価など）
            $table->smallInteger('technical')->nullable();  // 技術力
            $table->smallInteger('usability')->nullable();  // 使いやすさ
            $table->smallInteger('design')->nullable();     // デザイン性
            $table->smallInteger('user_focus')->nullable(); // ユーザー目線

            // コメント
            $table->text('comment')->nullable();

            // checkedフラグ（デフォルト false）
            $table->boolean('checked')->default(false)->after('comment');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
