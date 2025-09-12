<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioAccess;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PortfolioAccessController extends Controller
{
    // サイトを見るリンク用
    public function track($portfolioId)
    {
        $portfolio = Portfolio::findOrFail($portfolioId);

        $userId = Auth::id(); // 未ログインなら null
        $today = now()->toDateString();

        // 1日1回のアクセスを記録
        PortfolioAccess::firstOrCreate([
            'portfolio_id' => $portfolio->id,
            'user_id' => $userId,
            'accessed_at' => $today,
        ]);

        return redirect()->away($portfolio->url);
    }

    // アクセス数画面表示
    public function showAccess(Portfolio $portfolio)
    {
        $portfolio->load('accesses');

        // --- 折れ線グラフ用（日別ユニークユーザー数）
        $accessData = $portfolio->accesses()
            ->selectRaw('accessed_at, COUNT(DISTINCT user_id) as count')
            ->groupBy('accessed_at')
            ->orderBy('accessed_at')
            ->get();

        // --- タグ別アクセス傾向（散布図用）
        // users と tags を join して、どのタグのユーザーがどれくらいアクセスしたかを取得
        $tagAccessData = $portfolio->accesses()
            ->join('users', 'portfolio_accesses.user_id', '=', 'users.id')
            ->join('tag_user', 'users.id', '=', 'tag_user.user_id') // 中間テーブル
            ->join('tags', 'tag_user.tag_id', '=', 'tags.id')
            ->selectRaw('tags.name as tag_name, COUNT(DISTINCT portfolio_accesses.user_id) as user_count')
            ->groupBy('tags.name')
            ->orderByDesc('user_count')
            ->get();

        return Inertia::render('Portfolios/Access', [
            'portfolio' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
            ],
            'accessData'   => $accessData,    // 折れ線グラフ用
            'tagAccessData'=> $tagAccessData, // 散布図用
        ]);
    }
}
