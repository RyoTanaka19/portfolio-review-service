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


    public function usage()
    {
        return Inertia::render('Staticpages/Usage', [
            'title' => '使い方',
        ]);
    }
}
