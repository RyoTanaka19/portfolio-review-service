<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Advice;

class AdviceController extends Controller
{
    public function store(Request $request)
    {
        // バリデーション
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'target_users' => 'required|string',
            'issues' => 'nullable|string',
        ]);

        $prompt = "私はポートフォリオレビューサービスの開発者です。
サービス名: {$request->name}
サービス概要: {$request->description}
ユーザー層: {$request->target_users}
現在の進捗: {$request->issues}

上記を元に、このサービスに関して**結論から簡潔に改善点やアドバイスを説明し、最後にまとめとして締めくくる形式**で教えてください。
箇条書きや短文を使って、ユーザーに分かりやすく伝えるようにしてください。";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1500,
            ]);

            // HTTPステータスと生レスポンスをログに残す
            Log::info('OpenAI API HTTP Status: ' . $response->status());
            Log::info('OpenAI API Raw Response: ' . $response->body());

            if (!$response->ok()) {
                return response()->json([
                    'error' => 'OpenAI APIから正常なレスポンスが返りませんでした',
                    'http_status' => $response->status(),
                    'raw_response' => $response->body(),
                ], 500);
            }

            $responseData = $response->json();

            $adviceText = $responseData['choices'][0]['message']['content'] ?? 'AIからの応答がありません。';

            // DBに保存
            $advice = Advice::create([
                'user_id' => Auth::id(),
                'service_name' => $request->name,
                'service_description' => $request->description,
                'target_users' => $request->target_users,
                'service_issues' => $request->issues,
                'ai_advice' => $adviceText,
            ]);

        } catch (\Exception $e) {
            // 例外発生時もブラウザで確認
            Log::error('OpenAI API Exception: ' . $e->getMessage());
            return response()->json([
                'error' => 'AI APIへの接続で例外が発生しました',
                'exception_message' => $e->getMessage(),
            ], 500);
        }

        // ブラウザでデバッグできる形で返す
        return response()->json([
            'advice' => $adviceText,
            'debug_http_status' => $response->status(),
            'debug_raw_response' => $response->body(),
        ]);
    }

    public function index()
    {
        $advices = Advice::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($advices);
    }

    public function destroy($id)
{
    $advice = Advice::where('user_id', Auth::id())->find($id);

    if (!$advice) {
        return response()->json([
            'error' => 'アドバイスが見つかりませんでした'
        ], 404);
    }

    try {
        $advice->delete();
        return response()->json(['message' => '削除しました']);
    } catch (\Exception $e) {
        return response()->json([
            'error' => '削除中にエラーが発生しました',
            'exception_message' => $e->getMessage()
        ], 500);
    }
}
}
