#!/bin/bash

echo "🚀 PMEC ACMS Production Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the ACMS_production folder."
    exit 1
fi

echo "✅ Laravel application detected"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp production.env .env
    echo "⚠️  Please edit .env file with your actual database credentials and settings"
    echo "   Then run this script again."
    exit 0
fi

echo "✅ Environment file found"

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
# Remove any existing lock file and vendor directory
rm -f composer.lock
rm -rf vendor

# Use production composer.json without dev dependencies
cp composer.production.json composer.json
composer install --optimize-autoloader

if [ $? -ne 0 ]; then
    echo "❌ Composer install failed"
    exit 1
fi

echo "✅ PHP dependencies installed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production --legacy-peer-deps || npm install --production --force

if [ $? -ne 0 ]; then
    echo "❌ NPM install failed"
    exit 1
fi

echo "✅ Node.js dependencies installed"

# Build production assets
echo "🔨 Building production assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Asset build failed"
    exit 1
fi

echo "✅ Production assets built"

# Set permissions
echo "🔒 Setting file permissions..."
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chmod -R 644 public/

echo "✅ Permissions set"

# Clear caches
echo "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "✅ Caches cleared"

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    echo "   Please check your database configuration in .env file"
    exit 1
fi

echo "✅ Database migrations completed"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Point your web server to the 'public' folder"
echo "   2. Ensure your domain points to this folder"
echo "   3. Test the application at your domain"
echo ""
echo "🔍 To verify deployment:"
echo "   - Check browser console for CORS errors"
echo "   - Verify assets load from your domain"
echo "   - Test login functionality"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
