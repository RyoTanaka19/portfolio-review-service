<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class NotificationController extends Controller
{
    // 未読通知を取得（レビュー確認済みフラグも含む）
    public function index(Request $request)
    {
        try {
            $notifications = $request->user()->unreadNotifications
                ->filter(function ($n) {
                    // comment が空の通知は除外
                    return !empty($n->data['comment'] ?? null);
                })
                ->map(function ($n) {
                    return [
                        'id' => $n->id,
                        'data' => $n->data, // そのまま配列を返す
                        'read_at' => $n->read_at,
                        'created_at' => $n->created_at,
                        'review_checked' => $n->review_checked ?? false,
                    ];
                });

            return response()->json(['notifications' => $notifications]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => '通知の取得中にエラーが発生しました',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // 通知を既読にする
    public function markAsRead(Request $request, $id)
    {
        try {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->markAsRead();

            return response()->json(['status' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => '通知が見つかりません'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => '通知を既読にする際にエラーが発生しました',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
