<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\CustomResetPassword;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'auth_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

   public function tags()
{
    return $this->belongsToMany(Tag::class, 'tag_user', 'user_id', 'tag_id');
}

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

    /**
     * ユーザーのお気に入り（ブックマーク）リレーション
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * ユーザーがブックマークしたポートフォリオ
     */
    public function bookmarkedPortfolios()
    {
        return $this->belongsToMany(Portfolio::class, 'bookmarks');
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }
}
