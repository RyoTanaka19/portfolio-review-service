<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // 未読通知を取得
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications->map(function ($n) {
            return [
                'id' => $n->id,
                'data' => $n->data, // そのまま配列を返す
                'read_at' => $n->read_at,
                'created_at' => $n->created_at,
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
}
