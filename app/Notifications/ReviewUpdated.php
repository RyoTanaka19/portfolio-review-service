<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewUpdated extends Notification
{
    use Queueable;

    protected $review;
    protected $oldComment;

    public function __construct(Review $review, ?string $oldComment)
    {
        $this->review = $review;
        $this->oldComment = $oldComment;
    }

    public function via($notifiable)
    {
        if (empty($this->review->comment)) {
            return [];
        }

        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $old = $this->oldComment ?: '(未入力)';
        $new = $this->review->comment;

        return [
            'review_id' => $this->review->id,
            'portfolio_id' => $this->review->portfolio_id,
            'message' => "{$this->review->user->name}さんがレビューを更新しました。以前の内容: {$old} → 現在の内容: {$new}",
            'rating' => $this->review->rating,
            'comment' => $new,
        ];
    }
}
