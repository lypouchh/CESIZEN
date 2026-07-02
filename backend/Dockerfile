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

# Copier les fichiers du projet
COPY . .

# Installer les dépendances PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Donner les permissions appropriées
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Execution non-root
USER www-data

# Exposer le port
EXPOSE 9000

# Commande par défaut
CMD ["php-fpm"]
