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
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:255',
        ]);

        Portfolio::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url,
        ]);

        return redirect()->route('dashboard');
    }

    // 投稿詳細
    public function show(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Portfolios/Show', [
            'portfolio' => $portfolio,
        ]);
    }

    // 投稿編集フォーム
    public function edit(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Portfolios/Edit', [
            'portfolio' => $portfolio,
        ]);
    }

    // 投稿更新
    public function update(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:255',
        ]);

        $portfolio->update([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url,
        ]);

        return redirect()->route('dashboard')->with('success', 'ポートフォリオを更新しました');
    }

    // ポートフォリオ削除
    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $portfolio->delete();

        return redirect()->route('dashboard')->with('success', 'ポートフォリオを削除しました');
    }
}
