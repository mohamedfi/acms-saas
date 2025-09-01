#!/bin/bash

echo "🧹 FORCE CLEAN INSTALL - Removing ALL Pail References"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the ACMS_production folder."
    exit 1
fi

echo "✅ Laravel application detected"

# Stop on any error
set -e

echo "🗑️  Removing ALL dependency files..."
rm -rf vendor composer.lock composer.json

echo "📦 Restoring production composer.json..."
cp composer.production.json composer.json

echo "🧹 Clearing ALL Laravel caches..."
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

echo "🗑️  Removing compiled class files..."
rm -rf bootstrap/cache/*.php 2>/dev/null || true

echo "📦 Installing dependencies fresh..."
composer install --optimize-autoloader --no-dev

echo "🧹 Final cache clearing..."
php artisan config:clear
php artisan cache:clear

echo ""
echo "🎉 FORCE CLEAN INSTALL COMPLETED!"
echo "📋 All Pail references have been removed."
echo "📋 You can now run the main deployment script:"
echo "   bash deploy.sh"
