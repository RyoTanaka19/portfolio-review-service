<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    // 投稿一覧表示（検索対応）
    public function index(Request $request)
    {
        $query = Portfolio::with(['tags', 'user'])
            ->where('user_id', auth()->id());

        // ユーザー名で検索
        if ($request->filled('user_name')) {
            $userName = $request->input('user_name');
            $query->whereHas('user', function ($q) use ($userName) {
                $q->where('name', 'like', "%{$userName}%");
            });
        }

        // タグ名で検索
        if ($request->filled('tag')) {
            $tagName = $request->input('tag');
            $query->whereHas('tags', function ($q) use ($tagName) {
                $q->where('name', 'like', "%{$tagName}%");
            });
        }

        $portfolios = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'url' => $p->url,
                'user_id' => $p->user_id,
                'user_name' => $p->user->name ?? '未設定',
                'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
            ];
        });

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => $request->only(['user_name', 'tag']), // 現在の検索条件を渡す
        ]);
    }

    // 新規投稿フォーム表示
    public function create()
    {
        return Inertia::render('Portfolios/Create');
    }

    // 投稿保存
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $portfolio = Portfolio::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'] ?? null,
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id;
            }
            $portfolio->tags()->sync($tagIds);
        }

        return redirect()->route('dashboard')->with('success', 'ポートフォリオを作成しました');
    }

    // 投稿詳細
    public function show(Portfolio $portfolio)
    {
        $portfolio->load(['reviews.user', 'tags', 'user']);

        return Inertia::render('Portfolios/Show', [
            'portfolio' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
                'description' => $portfolio->description,
                'url' => $portfolio->url,
                'user_id' => $portfolio->user_id,
                'user_name' => $portfolio->user->name ?? '未設定',
                'tags' => $portfolio->tags->map(fn($t) => $t->name)->toArray(),
                'reviews' => $portfolio->reviews->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'body' => $r->body,
                        'user_name' => $r->user->name ?? '未設定',
                        'created_at' => $r->created_at->format('Y-m-d H:i'),
                    ];
                }),
            ],
            'auth' => auth()->user(),
            'flash' => session()->all(),
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
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
                'tags' => $portfolio->tags->map(fn($t) => $t->name)->toArray(),
            ],
        ]);
    }

    // 投稿更新
    public function update(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $portfolio->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'] ?? null,
        ]);

        $tagIds = [];
        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id;
            }
        }
        $portfolio->tags()->sync($tagIds);

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
