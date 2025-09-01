#!/bin/bash

echo "🔍 SEARCH AND DESTROY - Finding ALL Pail References"
echo "==================================================="

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the ACMS_production folder."
    exit 1
fi

echo "✅ Laravel application detected"

echo "🔍 Searching for Pail references in files..."
echo "--------------------------------------------"

# Search for Pail references in various locations
echo "1. Searching in bootstrap/cache..."
find bootstrap/cache -name "*.php" -exec grep -l "Pail" {} \; 2>/dev/null || echo "No Pail references found in bootstrap/cache"

echo "2. Searching in config files..."
find config -name "*.php" -exec grep -l "Pail" {} \; 2>/dev/null || echo "No Pail references found in config files"

echo "3. Searching in composer files..."
grep -l "Pail" composer.* 2>/dev/null || echo "No Pail references found in composer files"

echo "4. Searching in vendor directory..."
find vendor -name "*.php" -exec grep -l "Pail" {} \; 2>/dev/null | head -10 || echo "No Pail references found in vendor (or vendor doesn't exist)"

echo "5. Searching for Pail in Laravel cache..."
php artisan config:show 2>&1 | grep -i "pail" || echo "No Pail found in Laravel config cache"

echo ""
echo "🗑️  Now removing ALL Pail-related files and caches..."
echo "----------------------------------------------------"

# Remove all possible Pail references
rm -rf vendor composer.lock composer.json
rm -rf bootstrap/cache/*.php 2>/dev/null || true
rm -rf storage/framework/cache/* 2>/dev/null || true
rm -rf storage/framework/config/* 2>/dev/null || true
rm -rf storage/framework/views/* 2>/dev/null || true

echo "📦 Restoring clean production composer.json..."
cp composer.production.json composer.json

echo "🧹 Installing dependencies fresh..."
composer install --optimize-autoloader --no-dev

echo "🧹 Final verification - clearing all caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "🎉 Pail references have been SEARCHED AND DESTROYED!"
echo "📋 You can now run the main deployment script:"
echo "   bash deploy.sh"
