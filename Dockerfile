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

# Laravel アプリコピー
COPY . /var/www/html

# Composer install
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Nginx 設定コピー
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Supervisor 設定（PHP-FPM をバックグラウンドで起動）
RUN echo "[supervisord]\nnodaemon=true\n\n[program:php-fpm]\ncommand=/usr/local/sbin/php-fpm" > /etc/supervisor/conf.d/supervisord.conf

# Supervisor を使って PHP-FPM を起動
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
