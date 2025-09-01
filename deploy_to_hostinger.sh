#!/bin/bash

# 🚀 ACMS SaaS - Hostinger Deployment Script
echo "🚀 Starting ACMS SaaS deployment to Hostinger..."

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from the ACMS SaaS project root directory"
    exit 1
fi

# Build frontend assets
echo "📦 Building frontend assets..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Please fix errors and try again."
    exit 1
fi

# Commit any pending changes
echo "💾 Committing any pending changes..."
git add .
git commit -m "Pre-deployment commit - $(date)"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your connection."
    exit 1
fi

echo ""
echo "✅ Local deployment preparation complete!"
echo ""
echo "📋 Next steps on Hostinger:"
echo "1. SSH into your Hostinger server"
echo "2. Navigate to your web directory"
echo "3. Run: git pull origin main"
echo "4. Follow the deployment guide in HOSTINGER_DEPLOYMENT.md"
echo ""
echo "🔗 Your updated code is now on GitHub and ready for deployment!"
echo "🌐 Deploy to: acms.egypt-soft.net"
