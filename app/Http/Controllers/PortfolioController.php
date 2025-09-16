<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class PortfolioController extends Controller
{
    // 投稿一覧表示（検索対応）
public function index()
{
    $userId = auth()->id();

    $portfolios = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks'])
        ->get()
        ->map(fn($p) => $this->mapPortfolio($p, $userId));

    $allTags = Tag::pluck('name');

    return Inertia::render('Portfolios/Index', [
        'portfolios' => $portfolios,
        'filters' => [],
        'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
        'allTags' => $allTags,
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ]);
}
public function search(Request $request)
{
    $userId = auth()->id();

    $query = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks']);

    // 🔹 ユーザー名で検索
    if ($request->filled('user_name')) {
        $userName = $request->input('user_name');
        $query->whereHas('user', fn($q) => $q->where('name', 'like', "%{$userName}%"));
    }

    // 🔹 タグで検索
    if ($request->filled('tag')) {
        $tagName = $request->input('tag');
        $query->whereHas('tags', fn($q) => $q->where('name', 'like', "%{$tagName}%"));
    }

    $portfolios = $query->get()->map(fn($p) => $this->mapPortfolio($p, $userId));

    $allTags = Tag::pluck('name');

    return Inertia::render('Portfolios/Index', [
        'portfolios' => $portfolios,
        'filters' => $request->only(['user_name', 'tag']),
        'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
        'allTags' => $allTags,
    ]);
}
private function mapPortfolio($p, $userId)
{
    $isBookmarked = $userId ? $p->bookmarks->contains('user_id', $userId) : false;

    return [
        'id' => $p->id,
        'title' => $p->title,
        'description' => $p->description,
        'url' => $p->url,
        'github_url' => $p->github_url,
        'user_id' => $p->user_id,
        'user_name' => $p->user->name ?? '未設定',
        'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
        'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
        'reviews' => $p->reviews->map(fn($r) => [
            'id' => $r->id,
            'comment' => $r->comment,
            'rating' => $r->rating,
            'user' => [
                'id' => $r->user->id,
                'name' => $r->user->name ?? '未設定',
            ],
            'created_at' => $r->created_at->format('Y-m-d H:i'),
        ]),
        'is_bookmarked' => $isBookmarked,
    ];
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
        'url' => 'required|url|max:255',
        'github_url' => 'nullable|url|max:255',
        'tags' => 'required|array',
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
        'url' => $validated['url'],
        'github_url' => $validated['github_url'] ?? null,
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

    // Inertiaリダイレクト + flash
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
                'github_url' => $portfolio->github_url,
                'user_id' => $portfolio->user_id,
                'user_name' => $portfolio->user->name ?? '未設定',
                'image_url' => $portfolio->image_path ? Storage::url($portfolio->image_path) : null,
                'tags' => $portfolio->tags->map(fn($t) => $t->name)->toArray(),
                'reviews' => $portfolio->reviews->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'comment' => $r->comment,
                        'rating' => $r->rating,
                        'technical' => $r->technical,
                        'usability' => $r->usability,
                        'design' => $r->design,
                        'user_focus' => $r->user_focus,
                        'checked' => $r->checked,
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
                'github_url' => $portfolio->github_url, 
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
        'url' => 'required|url|max:255',
        'github_url' => 'nullable|url|max:255',
        'tags' => 'required|array',
        'tags.*' => 'string|max:50',
        'image' => 'nullable|image|max:2048',
        'delete_image' => 'nullable|boolean',
    ]);

    $portfolio->update([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'url' => $validated['url'],
        'github_url' => $validated['github_url'] ?? null,
    ]);

    // 新しい画像アップロード
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

    // Inertiaリダイレクト + flash
    return redirect()->route('dashboard')->with('success', 'ポートフォリオを更新しました');
}


    // 投稿削除
    public function destroy(Portfolio $portfolio): JsonResponse
    {
        // 所有者チェック
        if ($portfolio->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'error' => '権限がありません'
            ], 403);
        }

        try {
            // 画像削除
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }

            // ポートフォリオ削除
            $portfolio->delete();

            return response()->json([
                'success' => true,
                'message' => 'ポートフォリオを削除しました',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => '削除中にエラーが発生しました: ' . $e->getMessage(),
            ], 500);
        }
    }
}
