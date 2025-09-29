
## 
![ogp](https://github.com/user-attachments/assets/ccbf9d39-73c8-4a54-8ad7-e3a5053b1469)

「ポートフォリオレビューサービス」は、ポートフォリオをレビューしあい、質を向上させるためのサービスです。


# 💡 このサービスを作った理由  

プログラミングスクールで初めてポートフォリオを作成し、実際にデプロイして他のユーザーに使ってもらうことで、自分では気づけない発見が多くありました。また、他のユーザーのサービスを使うことで学びも多く、メリットを実感しました。

さらに、このポートフォリオレビューサービスを作成した経験から、1つ目のアプリ（Rails）と2つ目のアプリ（Laravel）で開発を経験することで、違う言語でも開発スピードが上がることを実感しました。
最初の卒業制作では何を作ればよいか分からず、事前に準備せずに制作しましたが、もし事前にアプリを作っていれば、時間を有効活用でき、ユーザー目線での開発もできたと感じています。

この経験から、ポートフォリオの質向上だけでなく、新しいサービスを作るきっかけになるようなサービスを作りたいと思い、このアプリを開発しました。


# 👥 想定ユーザー  
- 作成したサービスの改善・向上したい方
- アプリを作成したいけど、何を作成すれば良いかわからない方

 # 🖥️ 主な機能  

## 1. 新規登録・ログイン・パスワードリセット・プロフィール編集
<img width="1920" height="996" alt="new-regitration-explanation" src="https://github.com/user-attachments/assets/3687edd4-dcb7-48c4-a985-dcad50e3908d" /></br>
新規登録していない場合、まずは登録してください。
  
<img width="1911" height="996" alt="login-explanation" src="https://github.com/user-attachments/assets/478d1183-bffa-4ff1-8018-9f4ca3837f6a" /></br>
新規登録後、ログイン可能となります。また、Googlログインもできます。
  
<img width="1916" height="993" alt="password-reset-explanation" src="https://github.com/user-attachments/assets/2362c904-8c83-470c-a128-2cde0237f4c8" /></br>
パスワードがわからない場合、パスワードリセットできます。

![profile-edit-show-explanation](https://github.com/user-attachments/assets/95633a9c-f4de-48df-a6d5-3e71c9f9b628)</br>
プロフィールの編集もできます。




## 2. ポートフォリオ一覧・ 作成・投稿
<img width="1100" height="648" alt="portfolio-list-explanation" src="https://github.com/user-attachments/assets/57056362-0a21-4f88-b10c-db94c3ab2252" /></br>

- 投稿されているポートフォリオの一覧を確認できます。
  - 検索も可能です。

![portfolio-post-explanation](https://github.com/user-attachments/assets/5ce73a5b-94f9-4091-974d-d593f1b8063d)</br>

- 投稿ボタンからポートフォリオ作成することができます。
  - サービスはデプロイ済みのURLを貼るようにお願います🙇‍♂️
  - OGPの画像が設定されていない場合、OGP画像なしと表示されます。
  - (画像表示させたい場合、OGP画像の設定を予めお願いします。)

## 3. ポートフォリオのレビュー・通知
![portfolio-review-notificationexplanation](https://github.com/user-attachments/assets/d4d383c9-2b5d-4866-a5a3-41be9f5880be)</br>

- 投稿されているポートフォリオの詳細画面でレビューできます。
- コメントすると、コメント送信とレビューの確認チェックを入れると相手に通知が届きます。(説明や通知確認のため、現在自分にも通知が届くようになっております。

## 4. AI相談
<img width="1909" height="928" alt="ai-advise-explanation" src="https://github.com/user-attachments/assets/dacc0b3c-56de-4783-8293-968f1d1e21fd" /></br>

- AIに相談し、アドバイスをもらうことができます。 

## 5.ランキング
<img width="1921" height="922" alt="review-ranking-explanation" src="https://github.com/user-attachments/assets/0236d5d9-c683-48e7-90bc-a93d1b804fd3" /></br>
<br>
- 総合
- 技術力
- 使いやすさ
- デザイン性
- ユーザー目線
- 種類別にランキングを見ることができます。

## 6.お気に入り
![bookmark-explanation](https://github.com/user-attachments/assets/f7dc7091-bdac-4c81-a9ae-8977df6ebd5d)</br>
ブックマークすることができます。

## 6.アクセス数
<img width="1921" height="931" alt="portfolio-access-explanation" src="https://github.com/user-attachments/assets/50717e85-5f97-4959-bc27-77ee1dd52563" /></br>
- このサービスから投稿されているサービスのURLに遷移
- ポートフォリオの詳細画面にクリック
- ユーザーのアクセス数とユーザーのタグ別 アクセス数をグラフで確認

## 7 Twitterでシェア
![twiiter-share-explanation](https://github.com/user-attachments/assets/b1ee5ffa-c276-42bb-8531-c2537b6d1b8c)</br>
このサービスから直接ユーザーのポートフォリオをシェアすることができます。

  ___
# 🔧技術構成について
## 使用技術
|カテゴリ|技術内容|
|---|---|
|サーバーサイド|Laravel・PHP |
|フロントエンド|React(JavaScript)・Inertia.js|
|CSSフレームワーク|Tailwind CSS|
|データベースサーバー|PostgresSQL|
|認証|Breez|
|外部認証|GoogleLogin|
|Web API|Open API|
|ライブラリー|Chart.js|
|アプリケーションサーバ|Laravel Cloud(S3互換)|


