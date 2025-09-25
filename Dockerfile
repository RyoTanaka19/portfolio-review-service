FROM php:8.2-fpm

# 必要パッケージ
RUN apt-get update && apt-get install -y \
    libpq-dev curl zip unzip git nginx supervisor \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js インストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /var/www/html

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Laravelコピー & Composerインストール
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

# Nginx & Supervisor
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# php-fpm の TCP 9000 設定を上書き
RUN sed -i 's/listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Laravelキャッシュ
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
