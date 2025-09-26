<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\PortfolioHelper;
use App\Http\Requests\PortfolioRequest;

class PortfolioController extends Controller
{
    // 投稿一覧表示（検索対応）
    public function index()
    {
        $userId = auth()->id();

        $portfolios = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks'])
            ->paginate(10)
            ->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId));

        $allTags = Tag::pluck('name');

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => [],
            'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
            'allTags' => $allTags,
            'flash' => session('flash') ?? [],
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
        ]);
    }

    public function search(Request $request)
    {
        $userId = auth()->id();

        $query = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks']);

        if ($request->filled('user_name')) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', "%{$request->user_name}%"));
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('name', 'like', "%{$request->tag}%"));
        }

        $portfolios = $query->paginate(10)
            ->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId));

        $allTags = Tag::pluck('name');

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => $request->only(['user_name', 'tag']),
            'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
            'allTags' => $allTags,
        ]);
    }

    // 新規投稿フォーム
    public function create()
    {
        return Inertia::render('Portfolios/Create');
    }

    // 投稿保存
    public function store(PortfolioRequest $request)
    {
        $validated = $request->validated();

        $portfolio = Portfolio::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'],
            'github_url' => $validated['github_url'] ?? null,
        ]);

        // タグ保存
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id;
            }
            $portfolio->tags()->sync($tagIds);
        }

        return redirect()->route('dashboard')->with('flash', ['success' => 'ポートフォリオを作成しました']);
    }

    // 投稿詳細
    public function show(Portfolio $portfolio)
    {
        $portfolio->load(['reviews.user', 'tags', 'user']);

        return Inertia::render('Portfolios/Show', [
            'portfolio' => PortfolioHelper::mapPortfolio($portfolio, auth()->id()),
        ]);
    }

    // 投稿編集フォーム
    public function edit(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $portfolio->load('tags');

        return Inertia::render('Portfolios/Edit', [
            'portfolio' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
                'description' => $portfolio->description,
                'url' => $portfolio->url,
                'github_url' => $portfolio->github_url,
                'image_url' => PortfolioHelper::getOgImage($portfolio->url),
                'tags' => $portfolio->tags->pluck('name')->toArray(),
            ],
        ]);
    }

    // 投稿更新
    public function update(PortfolioRequest $request, Portfolio $portfolio)
    {
        $this->authorize('update', $portfolio);

        $validated = $request->validated();

        $portfolio->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'],
            'github_url' => $validated['github_url'] ?? null,
        ]);

        // タグ更新
        $tagIds = [];
        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id;
            }
        }
        $portfolio->tags()->sync($tagIds);

        return redirect()->route('dashboard')->with('flash', ['success' => 'ポートフォリオを更新しました']);
    }

    // 投稿削除
    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'error' => '権限がありません'
            ], 403);
        }

        try {
            $portfolio->delete();

            return response()->json([
                'success' => true,
                'message' => 'ポートフォリオを削除しました',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => '削除中にエラーが発生しました: ' . $e->getMessage(),
            ], 500);
        }
    }
}
