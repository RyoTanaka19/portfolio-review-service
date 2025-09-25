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
    gettext \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Composer インストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Laravel アプリ本体コピー（artisan を含む全ファイル）
COPY . /var/www/html

# Composer install
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Laravel キャッシュ生成
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Nginx 設定コピー
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Supervisor 設定（PHP-FPM と Nginx を同時に起動）
# envsubst で起動時に $PORT を置換して nginx を起動
RUN echo "[supervisord]\nnodaemon=true\nuser=root\n\n\
[program:php-fpm]\ncommand=/usr/local/sbin/php-fpm\n\
[program:nginx]\ncommand=/bin/sh -c 'envsubst \"\${PORT}\" < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.rendered && nginx -g \"daemon off;\" -c /etc/nginx/conf.d/default.conf.rendered'" \
> /etc/supervisor/conf.d/supervisord.conf

# Supervisor を使って PHP-FPM と Nginx を起動
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
