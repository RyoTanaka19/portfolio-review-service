<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Advice;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class AdviceController extends Controller
{
    public function create()
    {
        return Inertia::render('Advices/Create');
    }

public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'target_users' => 'required|string',
            'issues' => 'required|string',
        ]);

        $prompt = "私はポートフォリオレビューサービスの開発者です。
サービス名: {$validated['name']}
サービス概要: {$validated['description']}
ユーザー層: {$validated['target_users']}
現在の進捗: {$validated['issues']}

上記を元に、このサービスに関して結論から簡潔に改善点やアドバイスを説明し、最後にまとめとして締めくくる形式で教えてください。
箇条書きや短文を使って、ユーザーに分かりやすく伝えるようにしてください。";

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

        if (!$response->ok()) {
            return response()->json([
                'error' => 'OpenAI APIから正常なレスポンスが返りませんでした',
            ], 500);
        }

        $responseData = $response->json();
        $adviceText = $responseData['choices'][0]['message']['content'] ?? 'AIからの応答がありません。';

        Advice::create([
            'user_id' => Auth::id(),
            'service_name' => $validated['name'],
            'service_description' => $validated['description'],
            'target_users' => $validated['target_users'],
            'service_issues' => $validated['issues'],
            'ai_advice' => $adviceText,
        ]);

        return response()->json([
            'advice' => $adviceText,
            'flashMessage' => 'アドバイスをもらうことに成功しました',
        ]);

    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('AI API Exception: ' . $e->getMessage());
        return response()->json([
            'error' => 'AI APIへの接続で例外が発生しました',
        ], 500);
    }
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
