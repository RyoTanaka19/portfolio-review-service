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
# 依存関係の事前インストール
# composer.json / composer.lock のみコピー
# ----------------------------
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# ----------------------------
# アプリケーションコードコピー
# ----------------------------
COPY . .

# ----------------------------
# Node / npm 依存関係インストール
# ----------------------------
COPY package.json package-lock.json ./
RUN npm install

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
EXPOSE 9000
CMD ["php-fpm"]
