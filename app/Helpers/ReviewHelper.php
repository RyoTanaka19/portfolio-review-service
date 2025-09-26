<?php

namespace App\Helpers;

use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use App\Helpers\PortfolioHelper;

class ReviewHelper
{
    // ランキング取得の共通ロジック
    public static function getRanking(string $avgColumn)
    {
        $cacheKey = "ranking_{$avgColumn}";

        return Cache::remember($cacheKey, 60 * 5, function() use ($avgColumn) {
            return Portfolio::with(['user', 'tags', 'reviews'])
                ->withAvg('reviews', $avgColumn)
                ->has('reviews')
                ->orderByDesc("reviews_avg_{$avgColumn}")
                ->take(10)
                ->get()
                ->map(fn($p) => self::formatPortfolio($p, "reviews_avg_{$avgColumn}"));
        });
    }

    // フォーマット化
    public static function formatPortfolio($p, $avgColumn = 'reviews_avg_rating')
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'description' => $p->description,
            'url' => $p->url,
            'github_url' => $p->github_url,
            'user_name' => $p->user->name ?? '未設定',
            // URLからOGP画像を取得
            'image_url' => $p->url ? PortfolioHelper::getOgImage($p->url) : null,
            'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
            'avg_rating' => round($p->$avgColumn, 2),
            'review_count' => $p->reviews->count(),
        ];
    }

    // ランキングキャッシュ削除
    public static function clearRankingCache()
    {
        $columns = ['rating', 'technical', 'usability', 'design', 'user_focus'];
        foreach ($columns as $col) {
            Cache::forget("ranking_{$col}");
        }
    }
}
