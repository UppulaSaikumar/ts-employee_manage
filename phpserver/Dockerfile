FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql && composer require firebase/php-jwt

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy Composer files and install dependencies
COPY composer.json composer.lock* ./
RUN composer install

# Copy project files (adjust if needed)
COPY . .

# Run migration.php on container startup
CMD php migration.php && apache2-foreground

# Expose port 80
EXPOSE 80
