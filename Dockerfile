# ベースイメージ
FROM node:20-alpine AS node-build

# 作業ディレクトリ
WORKDIR /var/www/html

# package.json と package-lock.json を先にコピーして依存関係をインストール（キャッシュ活用）
COPY package*.json ./

# npm の依存関係インストール
RUN npm ci

# ソースコードをコピー
COPY resources/js ./resources/js
COPY resources/css ./resources/css
COPY vite.config.js ./
COPY tailwind.config.js ./

# Vite ビルド
RUN npm run build

# ここから PHP / Laravel 用のベースイメージに切り替え
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Node ビルド成果物をコピー
COPY --from=node-build /var/www/html/dist ./public/build

# Laravel ソース全体をコピー
COPY . .

# Composer インストール
RUN apk add --no-cache bash git unzip \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# 必要に応じて権限設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# PHP-FPM 起動
CMD ["php-fpm"]
