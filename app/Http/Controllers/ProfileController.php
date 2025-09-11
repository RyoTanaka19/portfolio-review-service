<?php

namespace App\Http\Controllers;

use App\Models\User; 
use App\Models\Portfolio; 
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

public function show(User $user)
{
    $authUserId = auth()->id();

    // 自分か他人か関係なく、そのユーザーのポートフォリオを取得
    $portfolios = $user->portfolios()->with('reviews', 'tags')->get();

    // 画像URLを生成
    $portfolios = $portfolios->map(function ($p) {
        $p->image_url = $p->image_path ? asset('storage/' . $p->image_path) : null;
        return $p;
    });

    return Inertia::render('Profile/Show', [
        'user' => $user,
        'authUserId' => $authUserId,
        'portfolios' => $portfolios,
    ]);
}
    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
