DockerFileFROM php:8.2-fpm

# PostgreSQL PDO ドライバと依存パッケージをインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
