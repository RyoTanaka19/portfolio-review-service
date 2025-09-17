<?php

namespace App\Helpers;

use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;

class PortfolioHelper
{
    /**
     * ポートフォリオを整形するメソッド
     *
     * @param Portfolio $p
     * @param int $userId
     * @return array
     */
    public static function mapPortfolio(Portfolio $p, $userId)
    {
        $isBookmarked = $userId ? $p->bookmarks->contains('user_id', $userId) : false;

        return [
            'id' => $p->id,
            'title' => $p->title,
            'description' => $p->description,
            'url' => $p->url,
            'github_url' => $p->github_url,
            'user_id' => $p->user_id,
            'user_name' => $p->user->name ?? '未設定',
            'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
            'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
            'reviews' => $p->reviews->map(fn($r) => [
                'id' => $r->id,
                'comment' => $r->comment,
                'rating' => $r->rating,
                'user' => [
                    'id' => $r->user->id,
                    'name' => $r->user->name ?? '未設定',
                ],
                'created_at' => $r->created_at->format('Y-m-d H:i'),
            ]),
            'is_bookmarked' => $isBookmarked,
        ];
    }
}
