<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * 一括代入可能なカラム
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * シリアライズ時に非表示にするカラム
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * 型変換
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * ユーザーが作成したポートフォリオ
     */
    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    /**
     * ユーザーが作成したレビュー
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
