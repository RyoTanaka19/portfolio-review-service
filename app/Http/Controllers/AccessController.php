<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Access;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccessController extends Controller
{
    /**
     * ポートフォリオのサービスへのアクセスを記録し、外部リンクにリダイレクト
     */
    public function track($portfolioId)
    {
        // ポートフォリオを取得（存在しなければ404）
        $portfolio = Portfolio::findOrFail($portfolioId);

        $userId = Auth::id();          // ログイン中のユーザーID（未ログインは null）
        $today  = now()->toDateString(); // 今日の日付（YYYY-MM-DD）

        // 1日1回だけアクセスを記録
        Access::firstOrCreate([
            'portfolio_id' => $portfolio->id,
            'user_id'      => $userId,
            'accessed_at'  => $today,
        ]);

        // サービスURLに遷移できない場合に備えて try-catch
        try {
            return redirect()->away($portfolio->service_url);
        } catch (\Exception $e) {
            // エラーをログに記録
            Log::error("Service URLへの遷移失敗: " . $e->getMessage());

            // ポートフォリオ一覧にリダイレクトしつつフラッシュメッセージを渡す
            return redirect()->route('portfolios.index')
                ->with('error', 'サービスに遷移できませんでした');
        }
    }

    /**
     * ポートフォリオのアクセス統計を取得して画面表示
     */
    public function index(Portfolio $portfolio)
    {
        // 関連するアクセス履歴をまとめて取得
        $portfolio->load('accesses');

        // 日別ユニークユーザー数（折れ線グラフ用）
        $accessData = $portfolio->accesses()
            ->selectRaw('accessed_at, COUNT(DISTINCT user_id) as count')
            ->groupBy('accessed_at')
            ->orderBy('accessed_at')
            ->get();

        // タグ別アクセス傾向（散布図用）
        $tagAccessData = $portfolio->accesses()
            ->join('users', 'accesses.user_id', '=', 'users.id')
            ->join('tag_user', 'users.id', '=', 'tag_user.user_id')
            ->join('tags', 'tag_user.tag_id', '=', 'tags.id')
            ->selectRaw('tags.name as tag_name, COUNT(DISTINCT accesses.user_id) as user_count')
            ->groupBy('tags.name')
            ->orderByDesc('user_count')
            ->get();

        // Inertiaでフロント側にデータを渡す
        return Inertia::render('Access/Index', [
            'portfolio' => [
                'id'    => $portfolio->id,
                'title' => $portfolio->title,
            ],
            'accessData'    => $accessData,
            'tagAccessData' => $tagAccessData,
        ]);
    }
}
