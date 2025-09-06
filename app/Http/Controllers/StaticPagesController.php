<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class StaticPagesController extends Controller
{
    public function terms()
    {
        return Inertia::render('Static/Terms', [
            'title' => '利用規約',
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy', [
            'title' => 'プライバシーポリシー',
        ]);
    }

    // お問い合わせフォーム画面（GET）
    public function form()
    {
        return Inertia::render('Static/ContactForm', [
            'title' => 'お問い合わせ',
        ]);
    }

    public function howTo()
{
    return Inertia::render('Static/HowTo', [
        'title' => '使い方',
    ]);
}

    // もしフォーム送信をサーバで受けるなら（POST）
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|email',
            'message' => 'required|max:2000',
        ]);

        // ここでメール送信やDB保存などを行う
        // 例: Mail::to(config('mail.from.address'))->send(new ContactMail($validated));

        return redirect()->route('contact')->with('success', 'お問い合わせを受け付けました。');
    }
}
