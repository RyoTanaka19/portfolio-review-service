FROM node:20-alpine AS node-build

WORKDIR /var/www/html

COPY package*.json ./
RUN npm ci

# resources 全体をコピーして import 解決を確実に
COPY resources ./resources
COPY vite.config.js ./
COPY tailwind.config.js ./

# ビルド
RUN npm run build

FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# ビルド成果物コピー
COPY --from=node-build /var/www/html/public/build ./public/build

# Laravel ソース全体
COPY . .

RUN apk add --no-cache bash git unzip \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["php-fpm"]
