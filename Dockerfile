FROM php:8.2-fpm

# 必要パッケージ
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    curl \
    git \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 既存 npm を削除して Node.js 20 をインストール
RUN apt-get remove -y npm \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /var/www/html

# Composer インストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# PHP 依存関係
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Node / npm 依存関係
COPY package.json package-lock.json ./
RUN npm install

# アプリケーションコード
COPY . .

# React + Vite ビルド
RUN npm run build

# 権限設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
