<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    // 投稿一覧表示（検索対応）
    public function index(Request $request)
    {
        $query = Portfolio::with(['tags', 'reviews.user', 'user'])
            ->where('user_id', auth()->id());

        if ($request->filled('user_name')) {
            $userName = $request->input('user_name');
            $query->whereHas('user', function ($q) use ($userName) {
                $q->where('name', 'like', "%{$userName}%");
            });
        }

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
                'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
                'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
                'reviews' => $p->reviews->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'comment' => $r->comment,
                        'rating' => $r->rating,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name ?? '未設定',
                        ],
                        'created_at' => $r->created_at->format('Y-m-d H:i'),
                    ];
                }),
            ];
        });

        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => $request->only(['user_name', 'tag']),
        ]);
    }

    // ランキング表示
    public function ranking()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'url' => $p->url,
                    'user_name' => $p->user->name ?? '未設定',
                    'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
                    'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
                    'avg_rating' => round($p->reviews_avg_rating, 2),
                    'review_count' => $p->reviews->count(),
                ];
            });

        return Inertia::render('Portfolios/Ranking', [
            'portfolios' => $portfolios,
        ]);
    }

    // 新規投稿フォーム
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
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('portfolios', 'public')
            : null;

        $portfolio = Portfolio::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'] ?? null,
            'image_path' => $imagePath,
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
                'image_url' => $portfolio->image_path ? Storage::url($portfolio->image_path) : null,
                'tags' => $portfolio->tags->map(fn($t) => $t->name)->toArray(),
                'reviews' => $portfolio->reviews->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'comment' => $r->comment,
                        'rating' => $r->rating,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name ?? '未設定',
                        ],
                        'created_at' => $r->created_at->format('Y-m-d H:i'),
                    ];
                }),
            ],
            'auth' => [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                ] : null,
            ],
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
                'image_url' => $portfolio->image_path ? Storage::url($portfolio->image_path) : null,
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
            'image' => 'nullable|image|max:2048',
        ]);

        $portfolio->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'] ?? null,
        ]);

        // 画像更新
        if ($request->file('image')) {
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }
            $portfolio->image_path = $request->file('image')->store('portfolios', 'public');
            $portfolio->save();
        }

        // タグ更新
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

    // 投稿削除
    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // 画像削除
        if ($portfolio->image_path) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        $portfolio->delete();

        return redirect()->route('dashboard')->with('success', 'ポートフォリオを削除しました');
    }
}
