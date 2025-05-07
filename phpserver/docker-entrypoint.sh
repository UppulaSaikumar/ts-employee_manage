#!/bin/bash

# sleep 10

# Run the migration script
echo "Running migration.php..."
php /var/www/html/migration.php

# Start Apache in foreground
echo "Starting Apache..."
apache2-foreground
