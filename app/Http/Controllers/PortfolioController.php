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
        $userId = auth()->id(); // 現在ログインしているユーザーIDを取得

        // ポートフォリオの情報をタグ、レビュー、ユーザー、ブックマークと共に取得
        $portfolios = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks'])
            ->paginate(10) // ページネーションで10件ずつ表示
            ->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId)); // ポートフォリオデータを整形

        // すべてのタグを取得
        $allTags = Tag::pluck('name');

        // Inertiaを使ってVueコンポーネントにデータを渡して表示
        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => [], // フィルター情報（空）
            'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
            'allTags' => $allTags,
            'flash' => session('flash') ?? [], // フラッシュメッセージ
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [], // バリデーションエラー
        ]);
    }

    // 投稿検索
    public function search(Request $request)
    {
        $userId = auth()->id(); // 現在ログインしているユーザーIDを取得

        // ポートフォリオのクエリを初期化
        $query = Portfolio::with(['tags', 'reviews.user', 'user', 'bookmarks']);

        // ユーザー名が指定されている場合、その条件で検索
        if ($request->filled('user_name')) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', "%{$request->user_name}%"));
        }

        // タグが指定されている場合、その条件で検索
        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('name', 'like', "%{$request->tag}%"));
        }

        // 検索結果をページネーションで取得
        $portfolios = $query->paginate(10)
            ->through(fn($p) => PortfolioHelper::mapPortfolio($p, $userId)); // ポートフォリオデータを整形

        // すべてのタグを取得
        $allTags = Tag::pluck('name');

        // 検索結果を表示するためにInertiaを使ってビューをレンダリング
        return Inertia::render('Portfolios/Index', [
            'portfolios' => $portfolios,
            'filters' => $request->only(['user_name', 'tag']), // フィルター情報を渡す
            'auth' => $userId ? ['user' => ['id' => $userId, 'name' => auth()->user()->name]] : null,
            'allTags' => $allTags,
        ]);
    }

    // 新規投稿フォームの表示
    public function create()
    {
        // 新規投稿用のフォームを表示
        return Inertia::render('Portfolios/Create');
    }

    // 投稿保存
    public function store(PortfolioRequest $request)
    {
        // バリデーション済みのデータを取得
        $validated = $request->validated();

        // 新しいポートフォリオを作成
        $portfolio = Portfolio::create([
            'user_id' => auth()->id(), // 現在のユーザーIDを設定
            'title' => $validated['title'],
            'description' => $validated['description'],
            'service_url' => $validated['service_url'],
            'github_url' => $validated['github_url'] ?? null,
        ]);

        // タグを保存
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                // タグがなければ新規作成
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id; // タグIDを配列に追加
            }
            // ポートフォリオとタグを関連付け
            $portfolio->tags()->sync($tagIds);
        }

        // ダッシュボードにリダイレクトし、成功メッセージを表示
        return redirect()->route('portfolios.index')->with('flash', ['success' => 'ポートフォリオを作成しました']);
    }

    // 投稿詳細の表示
    public function show(Portfolio $portfolio)
    {
        // 投稿の関連データ（レビュー、タグ、ユーザー）をロード
        $portfolio->load(['reviews.user', 'tags', 'user']);

        // ポートフォリオの詳細情報を表示
        return Inertia::render('Portfolios/Show', [
            'portfolio' => PortfolioHelper::mapPortfolio($portfolio, auth()->id()), // データを整形
        ]);
    }

    // 投稿編集フォームの表示
    public function edit(Portfolio $portfolio)
    {
        // 編集権限を確認（投稿が現在のユーザーのものか）
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // タグをロード
        $portfolio->load('tags');

        // 投稿編集フォームを表示
        return Inertia::render('Portfolios/Edit', [
            'portfolio' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
                'description' => $portfolio->description,
                'service_url' => $portfolio->service_url,
                'github_url' => $portfolio->github_url,
                'image_url' => PortfolioHelper::getOgImage($portfolio->service_url),
                'tags' => $portfolio->tags->pluck('name')->toArray(), // タグを配列に変換
            ],
        ]);
    }

    // 投稿更新
    public function update(PortfolioRequest $request, Portfolio $portfolio)
    {
        // 編集権限を確認
        if ($portfolio->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // バリデーション済みのデータを取得
        $validated = $request->validated();

        // 投稿を更新
        $portfolio->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'service_url' => $validated['service_url'],
            'github_url' => $validated['github_url'] ?? null,
        ]);

        // タグを更新
        $tagIds = [];
        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
                $tagIds[] = $tag->id; // タグIDを配列に追加
            }
        }
        $portfolio->tags()->sync($tagIds); // タグの同期

        // ダッシュボードにリダイレクトし、成功メッセージを表示
        return redirect()->route('portfolios.index')->with('flash', ['success' => 'ポートフォリオを更新しました']);
    }

    // 投稿削除
    public function destroy(Portfolio $portfolio)
    {
        // 編集権限を確認
        if ($portfolio->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'error' => '権限がありません'
            ], 403);
        }

        try {
            // ポートフォリオを削除
            $portfolio->delete();

            // 削除成功のメッセージを返す
            return response()->json([
                'success' => true,
                'message' => 'ポートフォリオを削除しました',
            ], 200);
        } catch (\Exception $e) {
            // エラーメッセージを返す
            return response()->json([
                'success' => false,
                'error' => '削除中にエラーが発生しました: ' . $e->getMessage(),
            ], 500);
        }
    }
}
