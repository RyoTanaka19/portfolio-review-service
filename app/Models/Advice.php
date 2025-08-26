<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Advice extends Model
{
    use HasFactory;

    // PostgreSQL 上の実際のテーブル名に合わせる
    protected $table = 'advices';

    // 保存可能なカラムを指定
    protected $fillable = [
        'user_id',
        'service_name',
        'service_description',
        'target_users',
        'service_issues',
        'ai_advice',
    ];

    /**
     * Advice と User のリレーション
     * 1つのアドバイスは1人のユーザーに属する
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
