<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewChecked extends Notification
{
    use Queueable;

    protected $checker;
    protected $review;

    public function __construct($checker, $review)
    {
        $this->checker = $checker;
        $this->review = $review;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "{$this->checker->name} さんがあなたのレビューを確認しました",
            'review_id' => $this->review->id,
            'comment' => $this->review->comment,
        ];
    }
}