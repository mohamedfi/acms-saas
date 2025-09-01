#!/bin/bash

echo "🔧 Fixing Pail Service Provider Issue"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the ACMS_production folder."
    exit 1
fi

echo "✅ Laravel application detected"

# Remove any cached references to Pail
echo "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Remove composer.lock and vendor to force fresh install
echo "🗑️  Removing existing dependencies..."
rm -rf vendor composer.lock

# Use production composer.json
echo "📦 Installing production dependencies..."
cp composer.production.json composer.json
composer install --optimize-autoloader

if [ $? -ne 0 ]; then
    echo "❌ Composer install failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Clear caches again
echo "🧹 Final cache clearing..."
php artisan config:clear
php artisan cache:clear

echo ""
echo "🎉 Pail issue fixed!"
echo "📋 You can now continue with the main deployment script:"
echo "   bash deploy.sh"
