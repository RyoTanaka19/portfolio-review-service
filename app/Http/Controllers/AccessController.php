<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Access; // ← ここを変更
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccessController extends Controller
{
    // サイトを見るリンク用
    public function track($portfolioId)
    {
        $portfolio = Portfolio::findOrFail($portfolioId);

        $userId = Auth::id(); // 未ログインなら null
        $today = now()->toDateString();

        // 1日1回のアクセスを記録
        Access::firstOrCreate([  // ← ここも変更
            'portfolio_id' => $portfolio->id,
            'user_id' => $userId,
            'accessed_at' => $today,
        ]);

        return redirect()->away($portfolio->url);
    }

    // アクセス数画面表示
    public function Index(Portfolio $portfolio)
    {
        $portfolio->load('accesses');

        // --- 折れ線グラフ用（日別ユニークユーザー数）
        $accessData = $portfolio->accesses()
            ->selectRaw('accessed_at, COUNT(DISTINCT user_id) as count')
            ->groupBy('accessed_at')
            ->orderBy('accessed_at')
            ->get();

        // --- タグ別アクセス傾向（散布図用）
        $tagAccessData = $portfolio->accesses()
            ->join('users', 'accesses.user_id', '=', 'users.id') // ← テーブル名も変更
            ->join('tag_user', 'users.id', '=', 'tag_user.user_id')
            ->join('tags', 'tag_user.tag_id', '=', 'tags.id')
            ->selectRaw('tags.name as tag_name, COUNT(DISTINCT accesses.user_id) as user_count') // ← テーブル名変更
            ->groupBy('tags.name')
            ->orderByDesc('user_count')
            ->get();

return Inertia::render('Access/Index', [
    'portfolio' => [
        'id' => $portfolio->id,
        'title' => $portfolio->title,
    ],
    'accessData'   => $accessData,
    'tagAccessData'=> $tagAccessData,
]);
    }
}
