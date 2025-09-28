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
        'repository_url' => $portfolio->repository_url,
        'image_url' => $portfolio->service_url ? self::getOgImage($portfolio->service_url) : null,
        'tags' => $portfolio->tags->pluck('name')->toArray(),
        'reviews' => $portfolio->reviews,
        'user' => $portfolio->user ? [
            'id' => $portfolio->user->id,
            'name' => $portfolio->user->name,
        ] : null,
        'is_bookmarked' => $portfolio->bookmarks->contains('user_id', $authUserId),
    ];
}
}
