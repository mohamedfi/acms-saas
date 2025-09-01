# 🚀 ACMS SaaS Deployment Guide

## 📋 Prerequisites

### Node.js Requirements
- **Node.js**: 20.19.0 or higher (22.12+ recommended)
- **npm**: 10.0.0 or higher
- **PHP**: 8.1+ (Laravel requirement)
- **Composer**: Latest version

### Check Current Versions
```bash
node --version    # Should be >= 20.19.0
npm --version     # Should be >= 10.0.0
php --version     # Should be >= 8.1
composer --version
```

## 🔧 Local Setup & Testing

### 1. Install Dependencies
```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

### 2. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database and other settings in .env
```

### 3. Database Setup
```bash
# Run migrations
php artisan migrate

# Seed database (if needed)
php artisan db:seed

# Clear and cache routes
php artisan route:clear
php artisan route:cache
php artisan config:cache
php artisan view:cache
```

## 🌐 GitHub Deployment

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: ACMS SaaS version"
```

### 2. Create .gitignore
```bash
# Laravel
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.phpunit.result.cache
docker-compose.override.yml
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log

# Build files (optional - can be built on server)
/public/build

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### 3. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/acms-saas.git
git branch -M main
git push -u origin main
```

## 🚀 Production Deployment

### Option 1: Traditional Hosting (Shared/VPS)

#### 1. Upload Files
```bash
# Upload via FTP/SFTP or Git clone
git clone https://github.com/yourusername/acms-saas.git
cd acms-saas
```

#### 2. Server Setup
```bash
# Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 3. Environment Configuration
```bash
# Configure .env for production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database configuration
DB_HOST=localhost
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### 4. Final Commands
```bash
php artisan migrate --force
php artisan route:cache
php artisan config:cache
php artisan view:cache
```

### Option 2: Cloud Platforms (Heroku, Railway, etc.)

#### 1. Platform-Specific Files
Create `Procfile` for Heroku:
```
web: vendor/bin/heroku-php-apache2 public/
```

#### 2. Environment Variables
Set all environment variables in your cloud platform dashboard.

#### 3. Build Process
Most cloud platforms will automatically run:
```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

## 🔒 Security Checklist

- [ ] `.env` file is not committed to Git
- [ ] `APP_DEBUG=false` in production
- [ ] Strong database passwords
- [ ] HTTPS enabled
- [ ] File permissions set correctly
- [ ] Storage and cache directories writable
- [ ] Composer dependencies updated
- [ ] Node.js dependencies updated

## 📊 Monitoring & Maintenance

### 1. Log Monitoring
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check error logs
tail -f /var/log/nginx/error.log
```

### 2. Performance Optimization
```bash
# Cache everything
php artisan route:cache
php artisan config:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 3. Regular Updates
```bash
# Update dependencies monthly
composer update
npm update

# Rebuild assets after updates
npm run build
```

## 🆘 Troubleshooting

### Common Issues

#### 1. Node.js Version Error
```bash
# Error: Vite requires Node.js version 20.19+ or 22.12+
# Solution: Update Node.js
nvm install 20.19.0
nvm use 20.19.0
```

#### 2. Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Permission Issues
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 📞 Support

For deployment issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check server error logs
3. Verify environment configuration
4. Ensure all dependencies are compatible

## 🔄 Deployment Checklist

- [ ] Node.js 20.19+ installed
- [ ] Dependencies installed (`composer install`, `npm install`)
- [ ] Frontend built (`npm run build`)
- [ ] Environment configured (`.env`)
- [ ] Database migrated (`php artisan migrate`)
- [ ] Caches cleared and rebuilt
- [ ] Permissions set correctly
- [ ] HTTPS configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
