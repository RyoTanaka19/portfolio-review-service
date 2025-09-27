<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Advice;
use Inertia\Inertia;
use App\Services\AIAdviceService;
use Illuminate\Validation\ValidationException;

class AdviceController extends Controller
{
    // 新しいアドバイス作成フォームを表示
    public function create()
    {
        return Inertia::render('Advices/Create');
    }

    // 新しいアドバイスを保存
    public function store(Request $request, AIAdviceService $aiService)
    {
        try {
            // リクエストデータのバリデーション
            $validated = $request->validate([
                'service_name' => 'required|string|max:255',
                'description' => 'required|string',
                'target_users' => 'required|string',
                'service_issues' => 'required|string',
            ]);

            // サービスクラスを使ってAIからアドバイスを生成
            $adviceText = $aiService->generateAdvice($validated);

            // 新しいアドバイスをデータベースに保存
            Advice::create([
                'user_id' => Auth::id(), // 現在のユーザーID
                'service_name' => $validated['service_name'],
                'service_description' => $validated['description'],
                'target_users' => $validated['target_users'],
                'service_issues' => $validated['service_issues'],
                'ai_advice' => $adviceText, // 生成されたAIアドバイス
            ]);

            // 成功レスポンス
            return response()->json([
                'advice' => $adviceText, // 生成されたアドバイス
                'flashMessage' => 'AIからのアドバイスをもらいました', // 成功メッセージ
            ]);

        } catch (ValidationException $e) {
            // バリデーションエラーが発生した場合
            return response()->json([
                'errors' => $e->errors(), // エラーの詳細を返す
            ], 422);
        } catch (\Exception $e) {
            // 予期しないエラー（AI API接続など）
            Log::error('AI API Exception: ' . $e->getMessage()); // エラーログを記録
            return response()->json([
                'error' => 'AI APIへの接続で例外が発生しました', // エラーメッセージ
            ], 500);
        }
    }

    // ユーザーが作成したアドバイスを一覧表示
    public function index()
    {
        // ログインしているユーザーのアドバイスを最新順に取得
        $advices = Advice::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc') // 作成日時の降順
            ->get();

        // Inertia.jsを使ってデータをフロントエンドに渡す
        return Inertia::render('Advices/Index', [
            'advices' => $advices, // ユーザーのアドバイス一覧
        ]);
    }

    // 特定のアドバイスを削除
    public function destroy($id)
    {
        // 削除するアドバイスをユーザーIDで検索
        $advice = Advice::where('user_id', Auth::id())->find($id);

        // アドバイスが見つからなかった場合
        if (!$advice) {
            return response()->json([
                'error' => 'アドバイスが見つかりませんでした' // エラーメッセージ
            ], 404);
        }

        try {
            // アドバイスの削除処理
            $advice->delete();
            return response()->json(['message' => 'アドバイスを削除しました']); // 成功メッセージ
        } catch (\Exception $e) {
            // 削除中にエラーが発生した場合
            return response()->json([
                'error' => '削除中にエラーが発生しました', // エラーメッセージ
                'exception_message' => $e->getMessage() // 例外の詳細
            ], 500);
        }
    }
}
