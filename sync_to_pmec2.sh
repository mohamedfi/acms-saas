#!/bin/bash

# Sync SMS and WhatsApp features from ACMS SaaS to PMEC2 Web
echo "🔄 Syncing SMS and WhatsApp features to PMEC2..."

# Define source and destination paths
SOURCE_DIR="/Applications/MAMP/htdocs/acms_saas"
DEST_DIR="/Applications/MAMP/htdocs/pmec2"

# Create necessary directories if they don't exist
mkdir -p "$DEST_DIR/config"
mkdir -p "$DEST_DIR/app/Services"

# Copy configuration files
echo "📁 Copying configuration files..."
cp "$SOURCE_DIR/config/whatsapp.php" "$DEST_DIR/config/"
cp "$SOURCE_DIR/config/twilio.php" "$DEST_DIR/config/"

# Copy service files
echo "🚀 Copying service files..."
cp "$SOURCE_DIR/app/Services/SMSService.php" "$DEST_DIR/app/Services/"
cp "$SOURCE_DIR/app/Services/WhatsAppService.php" "$DEST_DIR/app/Services/"
cp "$SOURCE_DIR/app/Services/CommunicationService.php" "$DEST_DIR/app/Services/"

# Copy updated provider
echo "⚙️ Copying updated provider..."
cp "$SOURCE_DIR/app/Providers/AppServiceProvider.php" "$DEST_DIR/app/Providers/"

# Copy updated routes
echo "🛣️ Copying updated routes..."
cp "$SOURCE_DIR/routes/web.php" "$DEST_DIR/routes/"

# Copy email template
echo "📧 Copying email template..."
mkdir -p "$DEST_DIR/resources/views/emails"
cp "$SOURCE_DIR/resources/views/emails/generic.blade.php" "$DEST_DIR/resources/views/emails/"

echo "✅ Sync completed successfully!"
echo ""
echo "📋 Next steps in PMEC2 directory:"
echo "1. cd /Applications/MAMP/htdocs/pmec2"
echo "2. composer require twilio/sdk"
echo "3. composer require netflie/laravel-notification-whatsapp"
echo "4. php artisan route:clear"
echo "5. Test the new features!"
