<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewCreated extends Notification
{
    use Queueable;

    protected $review;

    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    // コメントが空なら通知を送らない
    public function via($notifiable)
    {
        if (empty($this->review->comment)) {
            return []; // 空配列を返すと通知は送信されない
        }

        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'review_id' => $this->review->id,
            'portfolio_id' => $this->review->portfolio_id,
            'message' => "{$this->review->user->name}さんがあなたのポートフォリオにレビューしました。",
            'rating' => $this->review->rating,
            'comment' => $this->review->comment,
        ];
    }
}