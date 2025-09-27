<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewCreated extends Notification
{
    use Queueable;

    protected $review;

    // コンストラクタでレビューオブジェクトを受け取る
    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    // 通知を送信するチャネルを決定
    public function via($notifiable)
    {
        // コメントが空であれば通知は送らない
        if (empty($this->review->comment)) {
            return []; // 空配列を返すと通知は送信されない
        }

        return ['database']; // データベースチャネルを使って通知を送信
    }

    // データベースに保存する通知の内容を定義
    public function toDatabase($notifiable)
    {
        return [
            'review_id' => $this->review->id, // レビューのID
            'portfolio_id' => $this->review->portfolio_id, // 関連するポートフォリオのID
            'message' => "{$this->review->user->name}さんがあなたのポートフォリオにレビューしました。", // 通知メッセージ
            'rating' => $this->review->rating, // レビューの評価
            'comment' => $this->review->comment, // レビューのコメント
        ];
    }
}
