<?php

namespace App\Helpers;

use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use App\Helpers\PortfolioHelper;

class ReviewHelper
{
    /**
     * ランキング取得の共通ロジック
     * 
     * 指定した評価項目（例: rating, technical など）に基づいて
     * ポートフォリオのランキングを取得し、キャッシュに保存します。
     *
     * @param string $avgColumn 評価項目（例: rating, technical）
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getRanking(string $avgColumn)
    {
        $cacheKey = "ranking_{$avgColumn}"; // キャッシュ用のキーを作成

        // キャッシュからデータを取得（なければデータベースから取得）
        return Cache::remember($cacheKey, 60 * 5, function() use ($avgColumn) {
            return Portfolio::with(['user', 'tags', 'reviews'])  // ポートフォリオに関連するデータを一緒に取得
                ->withAvg('reviews', $avgColumn)  // 指定した評価項目の平均を取得
                ->has('reviews')  // 少なくとも1件のレビューがあるポートフォリオをフィルタリング
                ->orderByDesc("reviews_avg_{$avgColumn}")  // 指定した評価項目で降順にソート
                ->take(10)  // 上位10件を取得
                ->get()  // データを取得
                ->map(fn($p) => self::formatPortfolio($p, "reviews_avg_{$avgColumn}"));  // フォーマット化
        });
    }

    /**
     * ポートフォリオのデータを整形する
     * 
     * ポートフォリオのデータをランキング表示用に整形します。
     *
     * @param \App\Models\Portfolio $p フォーマットするポートフォリオオブジェクト
     * @param string $avgColumn 評価項目（デフォルトは 'reviews_avg_rating'）
     * @return array 整形されたポートフォリオのデータ
     */
    public static function formatPortfolio($p, $avgColumn = 'reviews_avg_rating')
    {
        return [
            'id' => $p->id,  // ポートフォリオのID
            'title' => $p->title,  // タイトル
            'description' => $p->description,  // 説明
            'service_url' => $p->service_url,  // サービスのURL
            'github_url' => $p->github_url,  // GitHubのURL
            'user_name' => $p->user->name ?? '未設定',  // ユーザー名（未設定の場合は '未設定' と表示）
            'image_url' => $p->service_url ? PortfolioHelper::getOgImage($p->service_url) : null,  // サービスURLからOGP画像を取得
            'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),  // タグ名を配列で取得
            'avg_rating' => round($p->$avgColumn, 2),  // 評価の平均値（2桁で四捨五入）
            'review_count' => $p->reviews->count(),  // レビュー件数
        ];
    }

    /**
     * ランキングキャッシュ削除
     * 
     * 評価項目（rating, technical, usability, design, user_focus）ごとの
     * ランキングキャッシュを削除します。ランキングデータが更新されたときに呼び出されます。
     */
    public static function clearRankingCache()
    {
        $columns = ['rating', 'technical', 'usability', 'design', 'user_focus'];  // キャッシュを削除する評価項目のリスト
        foreach ($columns as $col) {
            Cache::forget("ranking_{$col}");  // 各評価項目ごとのキャッシュを削除
        }
    }
}
