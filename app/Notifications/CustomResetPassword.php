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
    $url = url(route('password.reset', [
        'token' => $this->token,
        'email' => $notifiable->getEmailForPasswordReset(),
    ], false));

    return (new MailMessage)
        ->subject('【ポートフォリオレビューサービス】パスワード再設定のご案内')
        ->markdown('emails.custom_reset_password', [
            'name' => $notifiable->name,
            'url' => $url,
        ]);
}

    public function toArray($notifiable): array
    {
        return [];
    }
}
