<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    // 画像パスやGitHub URLも保存できるようにfillableを修正
    protected $fillable = [
        'user_id', 
        'title', 
        'description', 
        'url', 
        'github_url',  // 追加
        'image_path'
    ];

    /**
     * 投稿者 (1 Portfolio belongs to 1 User)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * レビュー (1 Portfolio has many Reviews)
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * タグ (Portfolio belongs to many Tags)
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * このポートフォリオをブックマークしたユーザー
     * (Bookmarkレコードを取得)
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * このポートフォリオをブックマークしたユーザー一覧
     */
    public function bookmarkedUsers()
    {
        return $this->belongsToMany(User::class, 'bookmarks');
    }
}
