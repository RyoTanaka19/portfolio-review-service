<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIAdviceService
{
    /**
     * AIにアドバイスを生成させる
     *
     * @param array $data ['service_name', 'description', 'target_users', 'service_issues']
     * @return string
     */
    public function generateAdvice(array $data): string
    {
        // OpenAIへのプロンプト作成
        $prompt = "私はポートフォリオレビューサービスの開発者です。
        サービス名: {$data['service_name']}
        サービス概要: {$data['description']}
        ユーザー層: {$data['target_users']}
        現在の進捗: {$data['service_issues']}

        上記を元に、このサービスに関して結論から簡潔に改善点やアドバイスを説明し、最後にまとめとして締めくくる形式で教えてください。
        箇条書きや短文を使って、ユーザーに分かりやすく伝えるようにしてください。";

        try {
            // OpenAI APIリクエスト
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

            // APIレスポンスが成功かどうかを確認
            if (!$response->ok()) {
                Log::error('OpenAI API failed', ['status' => $response->status()]);
                return 'AI APIから正常なレスポンスが返りませんでした';
            }

            // AIからのアドバイスを取得
            $responseData = $response->json();
            return $responseData['choices'][0]['message']['content'] ?? 'AIからの応答がありません。';
        } catch (\Exception $e) {
            // エラー発生時にログを記録し、メッセージを返す
            Log::error('AI API Exception: ' . $e->getMessage());
            return 'AI APIへの接続で例外が発生しました';
        }
    }
}
