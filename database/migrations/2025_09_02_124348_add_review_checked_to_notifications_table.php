<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('notifications', function (Blueprint $table) {
        $table->boolean('review_checked')->default(false);
    });
}

    /**
     * Reverse the migrations.
     */
public function down()
{
    Schema::table('notifications', function (Blueprint $table) {
        $table->dropColumn('review_checked');
    });
}
};
