<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class StaticPagesController extends Controller
{
    public function terms()
    {
        return Inertia::render('StaticPages/Terms', [
            'title' => '利用規約',
        ]);
    }

    public function privacy()
    {
        return Inertia::render('StaticPages/Privacy', [
            'title' => 'プライバシーポリシー',
        ]);
    }

    // お問い合わせフォーム画面（GET）
    public function form()
    {
        return Inertia::render('StaticPages/ContactForm', [
            'title' => 'お問い合わせ',
        ]);
    }
}
