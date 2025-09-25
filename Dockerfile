# PHP-FPM イメージ
FROM php:8.2-fpm

# 必要パッケージと PostgreSQL PDO をインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    curl \
    zip \
    unzip \
    git \
    nginx \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Composer インストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Laravel 本体コピー & Composer インストール
COPY . /var/www/html
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# storage と bootstrap/cache の権限設定
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Nginx & Supervisor 設定コピー
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 起動時に Laravel キャッシュを生成して Supervisor を起動
CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && php artisan view:cache && supervisord -c /etc/supervisor/conf.d/supervisord.conf"]
