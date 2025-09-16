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
            // rating を decimal(3,1) に変更（例: 1.3, 4.5 など保存可）
            $table->decimal('rating', 3, 1)->nullable()->change();

            // 各評価を nullable に変更
            $table->smallInteger('technical')->nullable()->change();
            $table->smallInteger('usability')->nullable()->change();
            $table->smallInteger('design')->nullable()->change();
            $table->smallInteger('user_focus')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // 元に戻す（例: smallint not null）
            $table->smallInteger('rating')->nullable(false)->change();
            $table->smallInteger('technical')->nullable(false)->change();
            $table->smallInteger('usability')->nullable(false)->change();
            $table->smallInteger('design')->nullable(false)->change();
            $table->smallInteger('user_focus')->nullable(false)->change();
        });
    }
};
