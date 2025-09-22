# PHP-FPMのベースイメージ
FROM php:8.2-fpm

# PostgreSQL PDOドライバと依存パッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /var/www/html

# Nginxをインストール
RUN apt-get update && apt-get install -y nginx

# Nginx設定ファイルをコンテナにコピー
COPY nginx.conf /etc/nginx/nginx.conf

# コンテナが起動する際に実行されるコマンド
CMD service nginx start && php-fpm
