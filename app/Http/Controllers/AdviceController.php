<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Advice;
use Inertia\Inertia;
use App\Services\AIAdviceService;
use Illuminate\Validation\ValidationException;

class AdviceController extends Controller
{
    public function create()
    {
        return Inertia::render('Advices/Create');
    }

    public function store(Request $request, AIAdviceService $aiService)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'target_users' => 'required|string',
                'issues' => 'required|string',
            ]);

            // サービスクラスでAIアドバイス生成
            $adviceText = $aiService->generateAdvice($validated);

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
        // ログインユーザーのアドバイスを取得
        $advices = Advice::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Inertiaでコンポーネントに渡す
        return Inertia::render('Advices/Index', [
            'advices' => $advices,
        ]);
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
