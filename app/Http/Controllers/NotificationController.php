<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class NotificationController extends Controller
{
    // 未読通知を取得し、レビュー確認済みフラグを含めて返す
    public function index(Request $request)
    {
        try {
            // ユーザーの未読通知をフィルタリングして取得
            $notifications = $request->user()->unreadNotifications
                // コメントがある通知のみをフィルタリング
                ->filter(function ($n) {
                    return !empty($n->data['comment'] ?? null);
                })
                // 通知の必要なデータを整形してマッピング
                ->map(function ($n) {
                    return [
                        'id' => $n->id,
                        'data' => $n->data,  // 通知データ（そのまま）
                        'read_at' => $n->read_at, // 既読日時
                        'created_at' => $n->created_at, // 通知作成日時
                        'review_checked' => $n->review_checked ?? false, // レビュー確認フラグ（なければfalse）
                    ];
                });

            // 取得した通知をJSON形式で返す
            return response()->json(['notifications' => $notifications]);
        } catch (\Exception $e) {
            // エラーが発生した場合、エラーメッセージを返す
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
            // 通知IDで該当の通知を取得
            $notification = $request->user()->notifications()->findOrFail($id);
            // 既読にする
            $notification->markAsRead();

            // 成功時のレスポンス
            return response()->json(['status' => 'ok']);
        } catch (ModelNotFoundException $e) {
            // 通知が見つからない場合
            return response()->json(['error' => '通知が見つかりません'], 404);
        } catch (\Exception $e) {
            // 他のエラーが発生した場合
            return response()->json([
                'error' => '通知を既読にする際にエラーが発生しました',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
