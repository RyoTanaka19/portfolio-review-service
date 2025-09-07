<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            // 新しいカラムを nullable にして追加
            $table->text('description_new')->nullable();
        });

        // 既存の description データをコピー
        DB::table('portfolios')->update([
            'description_new' => DB::raw('description')
        ]);

        Schema::table('portfolios', function (Blueprint $table) {
            // 古いカラムを削除
            $table->dropColumn('description');

            // 新しいカラムを description に rename
            $table->renameColumn('description_new', 'description');
        });
    }

    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->text('description')->nullable(false)->change();
        });
    }
};
