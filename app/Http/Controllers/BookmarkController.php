<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\PortfolioHelper;

class BookmarkController extends Controller
{
    /**
     * ブックマークを登録する
     *
     * @param Portfolio $portfolio
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Portfolio $portfolio)
    {
        // 現在ログインしているユーザーを取得
        $user = auth()->user();

        try {
            // ブックマークがすでに存在しない場合、登録
            $bookmark = Bookmark::firstOrCreate([
                'user_id' => $user->id,
                'portfolio_id' => $portfolio->id,
            ]);

            // 成功レスポンスを返す
            return response()->json([
                'success' => true,
                'message' => 'ブックマークしました',
            ]);
        } catch (\Exception $e) {
            // エラーレスポンスを返す
            return response()->json([
                'success' => false,
                'message' => 'ブックマークに失敗しました',
            ], 500);
        }
    }

    /**
     * ブックマークを解除する
     *
     * @param Portfolio $portfolio
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Portfolio $portfolio)
    {
        // 現在ログインしているユーザーを取得
        $user = auth()->user();

        try {
            // 既存のブックマークを削除
            Bookmark::where('user_id', $user->id)
                ->where('portfolio_id', $portfolio->id)
                ->delete();

            // 成功レスポンスを返す
            return response()->json([
                'success' => true,
                'message' => 'ブックマークを解除しました',
            ]);
        } catch (\Exception $e) {
            // エラーレスポンスを返す
            return response()->json([
                'success' => false,
                'message' => 'ブックマーク解除に失敗しました',
            ], 500);
        }
    }

    /**
     * ユーザーのお気に入りポートフォリオ一覧を表示する
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // 現在ログインしているユーザーを取得
        $user = auth()->user();

        // ユーザーがブックマークしたポートフォリオを取得し、関連情報をロード
        $bookmarks = Bookmark::with('portfolio.user', 'portfolio.tags', 'portfolio.reviews.user')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($b) use ($user) {
                $p = $b->portfolio;  // ポートフォリオ情報

                // ポートフォリオのデータを整形
                return [
                    'id' => $p->id,
                    'title' => $p->title,  // ポートフォリオタイトル
                    'description' => $p->description,  // ポートフォリオ説明
                    'service_url' => $p->service_url,  // サービスURL
                    'user_id' => $p->user_id,  // ポートフォリオのユーザーID
                    'user_name' => $p->user->name ?? '未設定',  // ユーザー名（未設定の場合は「未設定」）
                    // サービスURLからOGP画像を取得
                    'image_url' => $p->service_url ? PortfolioHelper::getOgImage($p->service_url) : null,
                    // タグ情報を整形
                    'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
                    // レビュー情報を整形
                    'reviews' => $p->reviews->map(fn($r) => [
                        'id' => $r->id,  // レビューID
                        'comment' => $r->comment,  // コメント内容
                        'rating' => $r->rating,  // 評価
                        'user' => [
                            'id' => $r->user->id,  // レビューしたユーザーID
                            'name' => $r->user->name ?? '未設定',  // ユーザー名（未設定の場合は「未設定」）
                        ],
                        'created_at' => $r->created_at->format('Y-m-d H:i'),  // 作成日時
                    ]),
                    'is_bookmarked' => true,  // ブックマークされているかどうか
                ];
            });

        // ブックマーク一覧を表示するためのInertiaビューを返す
        return Inertia::render('Bookmark/Index', [
            'portfolios' => $bookmarks,  // 整形されたポートフォリオデータ
            'auth' => ['user' => ['id' => $user->id, 'name' => $user->name]],  // ユーザー情報
        ]);
    }
}
