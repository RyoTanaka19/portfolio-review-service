@component('mail::message')
# パスワード再設定

{{ $name }} 様

以下のリンクをクリックして、パスワードを再設定してください。

@component('mail::button', ['url' => $url])
パスワード変更
@endcomponent

このリンクの有効期限は15分です。

もし心当たりがない場合は、このメールは無視してください。

ポートフォリオレビューサービス
@endcomponent
