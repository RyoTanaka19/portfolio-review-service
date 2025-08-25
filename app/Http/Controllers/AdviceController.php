<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AdviceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'target_users' => 'required|string',
            'issues' => 'nullable|string',
        ]);

        // プロンプトを「結論から簡潔に説明して締めくくる」形式に変更
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
                'max_tokens' => 1500, // 十分大きくして途中で切れないように
            ]);

            $responseData = $response->json();
            Log::info('OpenAI Response:', $responseData);

            $advice = $responseData['choices'][0]['message']['content'] ?? 'AIからの応答がありません。';
        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return response()->json([
                'advice' => 'AI APIへの接続でエラーが発生しました。'
            ], 500);
        }

        return response()->json(['advice' => $advice]);
    }
}
