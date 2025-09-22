# 必要な依存パッケージをインストール
FROM php:8.2-fpm

# PostgreSQL PDO ドライバと依存パッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /var/www/html

# 必要なパッケージのインストール
COPY . .

RUN apt-get update && apt-get install -y \
    libzip-dev \
    && docker-php-ext-install zip

# コンテナ内でのサービス起動ポートを設定
EXPOSE 80
