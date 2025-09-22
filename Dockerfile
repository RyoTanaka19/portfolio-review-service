FROM php:8.2-fpm

# PostgreSQL PDO ドライバと依存パッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /var/www/html

# アプリケーションコードをコンテナにコピー
COPY . /var/www/html

# Composer のインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Composer 依存関係のインストール
RUN composer install --no-dev --optimize-autoloader

# ポート 9000 を公開
EXPOSE 9000

# コンテナが起動した際に PHP-FPM を起動する
CMD ["php-fpm"]
