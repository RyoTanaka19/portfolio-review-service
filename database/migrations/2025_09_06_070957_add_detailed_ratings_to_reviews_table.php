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
        Schema::table('reviews', function (Blueprint $table) {
            $table->integer('technical')->default(5); // 技術力
            $table->integer('usability')->default(5); // 使いやすさ
            $table->integer('design')->default(5);    // デザイン性
            $table->integer('user_focus')->default(5); // ユーザー目線
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['technical', 'usability', 'design', 'user_focus']);
        });
    }
};
