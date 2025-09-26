<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class PortfolioHelper
{
    public static function getOgImage(string $url): ?string
    {
        try {
            // URLからHTMLを取得
            $response = Http::get($url);
            if (!$response->ok()) return null;

            $html = $response->body();

            // og:image メタタグを正規表現で取得
            if (preg_match('/<meta property="og:image" content="([^"]+)"/i', $html, $matches)) {
                return $matches[1]; // OGP画像URL
            }

            return null; // 見つからなければnull
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function mapPortfolio($portfolio, $authUserId = null)
    {
        return [
            'id' => $portfolio->id,
            'title' => $portfolio->title,
            'description' => $portfolio->description,
            'service_url' => $portfolio->service_url,
            'github_url' => $portfolio->github_url,
            'image_url' => $portfolio->service_url ? self::getOgImage($portfolio->service_url) : null,
            'tags' => $portfolio->tags->pluck('name')->toArray(),
            'reviews' => $portfolio->reviews,
            'user_id' => $portfolio->user_id,
            'user_name' => $portfolio->user->name ?? '未設定',
            'is_bookmarked' => $portfolio->bookmarks->contains('user_id', $authUserId),
        ];
    }
}
