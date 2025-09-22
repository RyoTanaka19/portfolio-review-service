FROM php:8.2-fpm

# PostgreSQL PDO ドライバと依存パッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Composerをインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Laravelアプリケーションのインストール
COPY . /var/www/html
RUN composer install --no-interaction --prefer-dist --optimize-autoloader
