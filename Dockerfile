# ----------------------------
# 基本イメージ
# ----------------------------
FROM php:8.2-fpm

# ----------------------------
# 必要パッケージ
# ----------------------------
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    curl \
    git \
    gnupg \
    lsb-release \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ----------------------------
# Node.js 20 インストール
# ----------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ----------------------------
# 作業ディレクトリ
# ----------------------------
WORKDIR /var/www/html

# ----------------------------
# Composer インストール
# ----------------------------
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ----------------------------
# PHP 依存関係インストール（composer.json / composer.lock のみコピー）
# ----------------------------
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# ----------------------------
# Node 依存関係インストール（package.json / package-lock.json のみコピー）
# ----------------------------
COPY package.json package-lock.json ./
RUN npm install

# ----------------------------
# アプリケーションコードコピー
# ----------------------------
COPY . .

# ----------------------------
# React + Vite ビルド
# ----------------------------
RUN npm run build

# ----------------------------
# 権限設定
# ----------------------------
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# ----------------------------
# ポートと起動コマンド
# ----------------------------
# nginxのポート80を公開
EXPOSE 80  
# PHP-FPMのポート9000を公開（必要に応じて）
EXPOSE 9000 

CMD ["php-fpm"]
