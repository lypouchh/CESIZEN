# Image de base : php:8.2.22-fpm-bookworm (épinglée par digest pour la reproductibilité)
FROM php@sha256:9de16d11baa9141d0f7893cfc16de6aac34826b0df11f6dcb5e17590e4edc3b7

# Mettre à jour les paquets système, installer les dépendances et les extensions PHP
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    curl \
    git \
    libonig-dev \
    libpng-dev \
    libpq-dev \
    libxml2-dev \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

# Installer Composer
COPY --from=composer:2.7.9 /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /app

# Copier les manifests Composer en premier pour optimiser le cache Docker
COPY composer.json composer.lock ./

# Installer les dépendances PHP sans exécuter les scripts pour le moment
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev --no-scripts

# Copier le reste du code source (dont artisan)
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY public ./public
COPY resources ./resources
COPY routes ./routes
COPY storage ./storage
COPY artisan ./artisan
COPY .env.example ./.env.example

# Lancer les scripts post-install et définir les permissions en une seule étape
RUN composer run-script post-autoload-dump --no-interaction && \
    chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Execution non-root
USER www-data

# Exposer le port
EXPOSE 9000

# Commande par défaut
CMD ["php-fpm"]