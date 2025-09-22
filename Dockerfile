FROM php:8.2-fpm

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY . /var/www/html

# Composerをインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Composerで依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000

# コンテナが起動した際に PHP-FPM を起動する
CMD ["php-fpm"]
