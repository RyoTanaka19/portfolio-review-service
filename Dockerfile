# ベースイメージ（PHP 8.2 + FPM）
FROM php:8.2-fpm

# 必要パッケージインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    curl \
    git \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ
WORKDIR /var/www/html

# Composerインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# PHP依存関係を先にコピー＆インストール
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Node.js依存関係インストール
COPY package.json package-lock.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

# React + Viteビルド
RUN npm run build

# 権限設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# FPMのポート
EXPOSE 9000
CMD ["php-fpm"]
