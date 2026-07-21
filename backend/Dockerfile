FROM php:8.2.22-fpm-bookworm

# Installer les dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install \
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
