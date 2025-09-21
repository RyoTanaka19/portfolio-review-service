# ベースイメージ（PHP 8.2 + FPM）
FROM php:8.2-fpm

# 必要パッケージインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    curl \
    git \
    gnupg \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js 20を公式リポジトリからインストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs npm

# 作業ディレクトリ
WORKDIR /var/www/html

# Composerインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 依存関係キャッシュ用：composer.json / package.jsonだけコピー
COPY composer.json composer.lock ./
COPY package.json package-lock.json ./

# PHP依存関係インストール
RUN composer install --no-dev --optimize-autoloader

# Node.js依存関係インストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Laravel artisan コマンドを安全に実行
RUN php artisan clear-compiled || true
RUN php artisan optimize:clear || true

# React + Viteビルド
RUN npm run build

# 権限設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# FPMのポート
EXPOSE 9000
CMD ["php-fpm"]
