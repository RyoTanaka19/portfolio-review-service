<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioAccess;
use Illuminate\Http\Request;
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

        // 日付ごとのユニークユーザー数
        $data = $portfolio->accesses()
            ->selectRaw('accessed_at, COUNT(DISTINCT user_id) as count')
            ->groupBy('accessed_at')
            ->orderBy('accessed_at')
            ->get();

        return Inertia::render('Portfolios/Access', [
            'portfolio' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
            ],
            'accessData' => $data,
        ]);
    }
}

