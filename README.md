# PMEC ACMS Production Package

This folder contains a production-ready version of the PMEC ACMS (Professional Management Expertise Center - Academy Course Management System) application.

## 🎯 What's Included

- **Complete Laravel Application** - All backend code, models, controllers, and middleware
- **Production Configuration** - Optimized settings for production deployment
- **Frontend Assets** - React components and styling (ready to build)
- **Database Structure** - Migrations and seeders for the complete system
- **Deployment Tools** - Scripts and guides for easy deployment

## 🚀 Quick Deployment

1. **Upload** this entire folder to your Hostinger server
2. **Rename** it to your desired folder name (e.g., `acms`)
3. **Run** the deployment script: `bash deploy.sh`
4. **Configure** your domain to point to the `public` folder

## 📁 Key Files

- `deploy.sh` - Automated deployment script
- `production.env` - Environment configuration template
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `vite.config.js` - Production Vite configuration (no localhost references)

## 🔧 Features

- **Course Management** - Create, edit, and manage training courses
- **Participant Management** - Handle course participants with ID/passport support
- **Logistics Management** - Manage venues, catering, and transportation
- **Attendance Tracking** - Monitor participant attendance
- **Modern UI/UX** - Clean, responsive interface with dropdown navigation
- **Role-Based Access** - Admin, coordinator, and trainer roles
- **File Uploads** - Support for participant ID/passport images
- **Visa Management** - Track visa requirements for international participants

## 🌐 Production Ready

- ✅ CORS properly configured for production domain
- ✅ Assets built for production environment
- ✅ Security settings optimized
- ✅ Performance optimizations enabled
- ✅ Error logging configured

## 📞 Support

If you need help with deployment:
1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Review the deployment script output for any errors
3. Check `storage/logs/laravel.log` for application errors
4. Ensure all environment variables are properly set

## 🎉 Ready to Deploy!

This package is configured and ready for production deployment on Hostinger or any other hosting provider. Follow the deployment guide for step-by-step instructions.
