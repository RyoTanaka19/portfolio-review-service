<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * パスワードリセットリンク入力画面を表示
     */
    public function create(): Response
    {
        // フラッシュメッセージ 'status' を渡して画面をレンダリング
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * パスワードリセットリンク送信処理
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 入力バリデーション（メールアドレス必須・形式チェック）
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'メールアドレスは必須です。',
            'email.email' => '正しいメールアドレスを入力してください。',
        ]);

        // パスワードリセットリンクを送信
        $status = Password::sendResetLink(
            $request->only('email') // email のみ取得
        );

        // 送信成功時
        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', __($status)); // 成功メッセージをフラッシュ
        }

        // 送信失敗時（ユーザー存在しない場合など）
        throw ValidationException::withMessages([
            'email' => [trans($status)], // エラーメッセージを email フィールドに紐付け
        ]);
    }
}
