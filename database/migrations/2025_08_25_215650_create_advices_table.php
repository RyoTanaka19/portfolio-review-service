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
        Schema::create('advices', function (Blueprint $table) { // テーブル名を複数形に修正
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ユーザーID
            $table->string('service_name'); // サービス名
            $table->text('service_description'); // サービス概要
            $table->text('target_users'); // ユーザー層
            $table->text('service_issues')->nullable(); // 課題
            $table->longText('ai_advice'); // AIのアドバイス
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advices');
    }
};
