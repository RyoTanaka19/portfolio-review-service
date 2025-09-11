<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class GoogleLoginController extends Controller
{
    // Google にリダイレクト
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // コールバック処理
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // メールでユーザー検索、なければ作成
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()], // ここで検索
                [
                    'name' => $googleUser->getName() ?? '名無し', // 名前がない場合はデフォルト
                    'password' => bcrypt(Str::random(16)),
                ]
            );

            Auth::login($user);

            // 元々アクセスしていたページにリダイレクト、なければ /portfolios
            return redirect()->intended('/portfolios');

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: '.$e->getMessage());
            return redirect('/login')->with('error', 'Googleログインに失敗しました');
        }
    }
}
