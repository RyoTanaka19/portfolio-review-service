<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Helpers\PortfolioHelper;  // 追加: ヘルパークラスをインポート
use Illuminate\Support\Str; 

use App\Http\Requests\PortfolioRequest;
use Illuminate\Pagination\LengthAwarePaginator;

class PortfolioController extends Controller
{
    // 投稿一覧表示（検索対応）
public function index()
{
    $userId = auth()->id();

    // 1ページに1件ずつ取得
    $portfolios = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks'])
        ->paginate(10) // ← 1件ずつ表示
        ->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId)); // mapPortfolioを適用

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

    // ページネーションを使う（1ページに1件例）
    $portfolios = $query->paginate(10)->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId));

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

        return redirect()->route('dashboard')->with('flash', ['success' => 'ポートフォリオを作成しました']);  // 修正: フラッシュメッセージを整理
    }

public function show(Portfolio $portfolio)
{
    $portfolio->load(['reviews.user', 'tags', 'user']);

    // OGP用のタイトルと説明を設定
    $ogTitle = $portfolio->title;
    $ogDescription = Str::limit($portfolio->description, 100); 
    $ogImageUrl = $portfolio->image_path 
        ? Storage::url($portfolio->image_path) 
        : asset('image/ogp.png'); // ← デフォルト画像のパスを指定

    return Inertia::render('Portfolios/Show', [
        'portfolio' => [
            'id' => $portfolio->id,
            'title' => $portfolio->title,
            'description' => $portfolio->description,
            'url' => route('portfolio.show', $portfolio), // 修正
            'user_id' => $portfolio->user_id,
            'user_name' => $portfolio->user->name ?? '未設定',
            'image_url' => $ogImageUrl,
            'tags' => $portfolio->tags->map(fn($t) => $t->name)->toArray(),
            'reviews' => $portfolio->reviews->map(fn($r) => [
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
            ]),
        ],
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
    public function update(PortfolioRequest $request, Portfolio $portfolio)
    {
        $validated = $request->validated();

        // 権限チェックは authorize() で済ませているので不要

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
        } elseif (!empty($validated['delete_image']) && $validated['delete_image']) {
            // 画像削除
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }
            $portfolio->image_path = null;
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

        return redirect()->route('dashboard')->with('flash', ['success' => 'ポートフォリオを更新しました']);
    }

    // 投稿削除
    public function destroy(Portfolio $portfolio)
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

            // 明示的に JSON を返す（型宣言なしでも Axios が data を取得可能）
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
