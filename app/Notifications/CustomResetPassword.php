<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification
{
    use Queueable;

    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        // パスワードリセットURLを生成
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('【PortfolioReview】パスワード再設定のご案内')
            ->line('こんにちは！')
            ->line('このメールは、あなたのアカウントに対してパスワード再設定のリクエストがあったため送信されています。')
            ->line('以下のリンクをクリックして、パスワードを再設定してください。')
            ->line($url) // リンクをそのまま表示（ボタンではなくURLのみ）
            ->line('このリンクの有効期限は60分です。')
            ->line('もし心当たりがない場合は、このメールは無視していただいて構いません。')
            ->salutation('PortfolioReview 運営');
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}
