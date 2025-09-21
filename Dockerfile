# PHP 8.2 FPMベースイメージ
FROM php:8.2-fpm

# システム依存パッケージのインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    curl \
    zip \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composerのインストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ設定
WORKDIR /var/www/html

# ホスト側のコードをコピー
COPY . .

# Laravelの依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# Node.js依存関係をインストールしてビルド
RUN npm install && npm run build

# 権限設定（必要に応じて）
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# ポート設定（Renderではデフォルトで80にリダイレクトされる場合あり）
EXPOSE 9000

# PHP-FPM起動
CMD ["php-fpm"]
