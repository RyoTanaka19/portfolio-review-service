<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class ReviewCreated extends Notification
{
    use Queueable;

    protected $review;

    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    // 通知をDBに保存する
    public function via($notifiable)
    {
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
