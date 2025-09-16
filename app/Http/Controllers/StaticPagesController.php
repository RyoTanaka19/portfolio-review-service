<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class StaticPagesController extends Controller
{
    public function terms()
    {
        return Inertia::render('Staticpages/Terms', [
            'title' => '利用規約',
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Staticpages/Privacy', [
            'title' => 'プライバシーポリシー',
        ]);
    }

    // お問い合わせフォーム画面（GET）
    public function form()
    {
        return Inertia::render('Staticpages/ContactForm', [
            'title' => 'お問い合わせ',
        ]);
    }

    public function howTo()
{
    return Inertia::render('Staticpages/HowTo', [
        'title' => '使い方',
    ]);
}
}
