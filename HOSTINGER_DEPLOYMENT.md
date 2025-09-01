# 🚀 ACMS SaaS - Hostinger Deployment Guide

## **📋 Prerequisites**

- ✅ ACMS SaaS project ready locally
- ✅ Hostinger hosting account with SSH access
- ✅ Domain: `acms.egypt-soft.net`
- ✅ SSH credentials for Hostinger

## **🔧 Step-by-Step Deployment**

### **Step 1: Connect to Hostinger via SSH**

```bash
ssh username@your-hostinger-server.com
# or
ssh username@acms.egypt-soft.net
```

### **Step 2: Navigate to Your Web Directory**

```bash
cd public_html
# or wherever your Laravel app should be deployed
```

### **Step 3: Clone/Pull Your ACMS SaaS Repository**

```bash
# If first time deployment:
git clone https://github.com/mohamedfi/acms-saas.git

# If updating existing deployment:
cd acms-saas
git pull origin main
```

### **Step 4: Install Dependencies**

```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies (if you have Node.js on Hostinger)
npm install
npm run build
```

### **Step 5: Set Up Environment**

```bash
# Copy environment file
cp .env.example .env

# Edit environment file with production settings
nano .env
```

### **Step 6: Configure Production Environment**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://acms.egypt-soft.net

# Database settings (from Hostinger)
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Email settings (your working Gmail config)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=mohamed.dawd71@gmail.com
MAIL_PASSWORD=oewx gcqw wvmg mfho
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=mohamed.dawd71@gmail.com

# SMS and WhatsApp (configure when ready)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### **Step 7: Set Permissions**

```bash
# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

### **Step 8: Generate Application Key**

```bash
php artisan key:generate
```

### **Step 9: Run Database Migrations**

```bash
php artisan migrate --force
```

### **Step 10: Clear and Cache**

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **Step 11: Set Up Web Server Configuration**

#### **For Apache (.htaccess should work automatically):**

Make sure your `.htaccess` file is in the `public` directory and points to `public/index.php`

#### **For Nginx (if using):**

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### **Step 12: Test Your Application**

Visit `https://acms.egypt-soft.net` to test:

- ✅ Homepage loads
- ✅ Login works
- ✅ Messaging system works
- ✅ All features functional

## **🔄 Future Updates**

### **Quick Update Process:**

```bash
# Connect via SSH
ssh username@acms.egypt-soft.net

# Navigate to project
cd public_html/acms-saas

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
composer install --optimize-autoloader --no-dev

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Re-cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## **🚨 Troubleshooting**

### **Common Issues:**

1. **500 Error**: Check storage permissions and .env file
2. **Database Connection**: Verify database credentials
3. **White Page**: Check Laravel logs in `storage/logs/laravel.log`
4. **Permission Denied**: Fix file ownership and permissions

### **Check Logs:**

```bash
tail -f storage/logs/laravel.log
```

## **📱 SMS & WhatsApp Activation**

### **After Deployment:**

1. **Get Twilio credentials** for SMS
2. **Get Meta Business API credentials** for WhatsApp
3. **Update .env file** with real credentials
4. **Test messaging system** on live site

## **🎯 Success Checklist**

- [ ] Application loads at `acms.egypt-soft.net`
- [ ] All features working (login, messaging, etc.)
- [ ] Email system functional
- [ ] Database connected and working
- [ ] SMS/WhatsApp ready for credentials
- [ ] Production environment optimized

---

**🚀 Your ACMS SaaS is now ready for production deployment!**
