<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewChecked extends Notification
{
    use Queueable;

    // レビューをチェックしたユーザーと、チェックされたレビューを保持するプロパティ
    protected $checker;
    protected $review;

    // コンストラクタでチェックしたユーザーとレビューを受け取る
    public function __construct($checker, $review)
    {
        $this->checker = $checker;
        $this->review = $review;
    }

    // 通知を送信する方法を定義（今回はデータベースに保存）
    public function via($notifiable)
    {
        return ['database'];
    }

    // 通知をデータベースに保存する内容を定義
    public function toDatabase($notifiable)
    {
        return [
            'message' => "{$this->checker->name} さんがあなたのレビューを確認しました", // チェックしたユーザーの名前を表示
            'review_id' => $this->review->id, // 関連するレビューのID
            'comment' => $this->review->comment, // レビューのコメント
        ];
    }
}
