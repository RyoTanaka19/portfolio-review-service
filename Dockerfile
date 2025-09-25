# PHP-FPM イメージ
FROM php:8.2-fpm

# 必要パッケージと PostgreSQL PDO
RUN apt-get update && apt-get install -y \
    libpq-dev curl zip unzip git \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js と npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /var/www/html

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# アプリケーションコピー & Composer インストール
COPY . /var/www/html
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Nodeモジュールインストール & Viteビルド
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 権限設定
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# php-fpm を 0.0.0.0:8080 で待ち受けるように設定
RUN sed -i 's|listen = .*|listen = 0.0.0.0:8080|' /usr/local/etc/php-fpm.d/www.conf

# Laravel キャッシュ
RUN php artisan config:clear && php artisan route:clear && php artisan view:clear
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Supervisor 設定
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
