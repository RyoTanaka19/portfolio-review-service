<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    // 未読通知を取得（レビュー確認済みフラグも含む）
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications->map(function ($n) {
            return [
                'id' => $n->id,
                'data' => $n->data, // そのまま配列を返す
                'read_at' => $n->read_at,
                'created_at' => $n->created_at,
                'review_checked' => $n->review_checked ?? false, // 追加
            ];
        });

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    // 通知を既読にする
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['status' => 'ok']);
    }

    // レビュー確認済みにする
    public function markAsChecked(Request $request, $id)
    {
        $notification = DatabaseNotification::findOrFail($id);

        // 自分の通知か確認
        if ($notification->notifiable_id !== $request->user()->id) {
            return response()->json(['error' => '権限がありません'], 403);
        }

        $notification->update(['review_checked' => true]);

        return response()->json(['status' => 'ok']);
    }
}
