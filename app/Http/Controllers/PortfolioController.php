<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    // 投稿一覧表示
    public function index()
    {
        // 現在ログインしているユーザーのポートフォリオを取得
        $portfolios = Portfolio::where('user_id', auth()->id())->get();

        \Log::info('Portfolio page accessed by user: ' . auth()->id());

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
        ]);
    }

    // 新規投稿フォーム表示
    public function create()
    {
        return Inertia::render('Portfolios/Create'); // React の New.jsx を表示
    }

    // 投稿保存
    public function store(Request $request)
    {
        // バリデーション
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:255',
        ]);

        // ポートフォリオ作成
        Portfolio::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url,
        ]);

        // 投稿一覧にリダイレクト
        return redirect()->route('dashboard');
    }

    // ポートフォリオ削除
    public function destroy(Portfolio $portfolio)
    {
        // ログインユーザーが所有している場合のみ削除
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $portfolio->delete();

        return redirect()->route('dashboard')->with('success', 'ポートフォリオを削除しました');
    }
}
