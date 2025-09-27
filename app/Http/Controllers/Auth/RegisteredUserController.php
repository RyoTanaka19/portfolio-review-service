<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\Auth\RegisterRequest;

class RegisteredUserController extends Controller
{
    /**
     * 新規登録ページを表示
     */
    public function create(): Response
    {
        // Inertiaを使ってフロントの Auth/Register ページを返す
        return Inertia::render('Auth/Register');
    }

    /**
     * ユーザー登録処理
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        // 新しいユーザーを作成（パスワードはハッシュ化して保存）
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // ユーザー登録イベントを発火（メール認証などのリスナーがあれば実行される）
        event(new Registered($user));

        // 作成したユーザーをそのままログイン状態にする
        Auth::login($user);

        // 登録完了後、ポートフォリオ一覧にリダイレクト + フラッシュメッセージ
        return redirect(route('portfolios.index', absolute: false))
            ->with('flash', ['success' => 'ユーザー登録が完了しました']);
    }
}
