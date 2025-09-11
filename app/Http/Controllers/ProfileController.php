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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // 画像URLを付与
        $user->profile_image_url = $user->profile_image
            ? asset('storage/' . $user->profile_image)
            : null;

        return Inertia::render('Profile/Edit', [
            'user' => $user,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Show the profile of a specific user.
     */
    public function show(User $user): Response
    {
        $authUserId = auth()->id();

        // ポートフォリオ一覧を取得
        $portfolios = $user->portfolios()->with('reviews', 'tags')->get();

        // ポートフォリオ画像URLを付与
        $portfolios = $portfolios->map(function ($p) {
            $p->image_url = $p->image_path ? asset('storage/' . $p->image_path) : null;
            return $p;
        });

        // プロフィール画像URLを付与
        $user->profile_image_url = $user->profile_image
            ? asset('storage/' . $user->profile_image)
            : null;

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
        $user = $request->user();

        // validated データを取得し、画像関連を除外して fill
        $data = $request->validated();
        unset($data['profile_image'], $data['delete_profile_image']);
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // プロフィール画像アップロード
        if ($request->hasFile('profile_image')) {
            // 既存画像があれば削除
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // 新しい画像を保存
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
        } elseif ($request->boolean('delete_profile_image')) {
            // 削除フラグがあれば既存画像を削除
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $user->profile_image = null;
        }

        $user->save();

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

        // プロフィール画像も削除
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
