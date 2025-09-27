# 🔧 Environment Variables Setup Guide

This guide will help you set up environment variables for both local development and production deployment.

## 📋 Required Environment Variables

### **Core Application Variables**

```env
# Database - Contabo MySQL Server
MYSQL_URL="mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key-for-walnut-production-2024"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Environment
NODE_ENV="production"
```

### **Optional Variables (for enhanced features)**

```env
# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Email (Resend or similar)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@chronovault.com"

# Instagram Basic Display API
INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"
INSTAGRAM_ACCESS_TOKEN="your-instagram-access-token"
INSTAGRAM_USER_ID="your-instagram-user-id"
```

## 🚀 Vercel Deployment Setup

### **Step 1: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `walsnut` repository

### **Step 2: Configure Environment Variables**

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

#### **Required Variables:**
```
MYSQL_URL = mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db
NEXTAUTH_URL = https://your-domain.vercel.app
NEXTAUTH_SECRET = your-nextauth-secret-key-for-walnut-production-2024
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
NODE_ENV = production
```

#### **Optional Variables:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
STRIPE_SECRET_KEY = sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET = whsec_your-webhook-secret
RESEND_API_KEY = your-resend-api-key
EMAIL_FROM = noreply@chronovault.com
```

### **Step 3: Deploy**

1. Click **Deploy** in Vercel
2. Wait for the build to complete
3. Your site will be live at `https://your-domain.vercel.app`

## 🗄️ Database Setup on Contabo

### **Step 1: Connect to Your Contabo Server**

```bash
ssh root@185.196.21.112
```

### **Step 2: Install and Configure MySQL**

```bash
# Update system
apt update && apt upgrade -y

# Install MySQL
apt install mysql-server -y

# Start MySQL
systemctl start mysql
systemctl enable mysql

# Create database and user
mysql -u root << 'EOF'
CREATE DATABASE walnut_db;
CREATE USER 'utsav'@'%' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON walnut_db.* TO 'utsav'@'%';
FLUSH PRIVILEGES;
EOF

# Configure remote access
sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL
systemctl restart mysql
```

### **Step 3: Set Up Database Schema**

After deployment, run these commands to set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with initial data
npm run db:seed
```

## 🔐 Security Notes

### **Important Security Considerations:**

1. **Change Default Passwords:**
   - Replace `YourStrongPassword` with a strong password
   - Update both server MySQL user and environment variables

2. **Secure NextAuth Secret:**
   - Generate a strong secret: `openssl rand -base64 32`
   - Use different secrets for development and production

3. **Database Security:**
   - Configure firewall to restrict MySQL access
   - Consider using SSL connections
   - Regular backups

4. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use Vercel's environment variables for production
   - Rotate secrets regularly

## 🧪 Testing the Setup

### **Test Credentials:**
```
Admin: admin@walnut.com / admin123
User:  user@walnut.com / user123
```

### **Test Flow:**
1. Visit your deployed site
2. Try to access `/orders` (should redirect to login)
3. Login with test credentials
4. Verify redirection works correctly
5. Test logout functionality

## 📊 Performance Monitoring

### **Database Performance:**
- Query times should be under 10ms
- Connection pooling enabled
- Indexes added for frequently queried columns

### **Authentication Performance:**
- Login time: ~500ms
- Logout: Instant
- Session management optimized

## 🆘 Troubleshooting

### **Common Issues:**

1. **Database Connection Failed:**
   - Check MySQL service is running on Contabo
   - Verify firewall allows port 3306
   - Confirm username/password in connection string

2. **Authentication Issues:**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure database users are created correctly

3. **Build Failures:**
   - Check all required environment variables are set
   - Verify Prisma schema is valid
   - Check for TypeScript errors

### **Support:**
- Check Vercel deployment logs
- Monitor Contabo server logs
- Use browser developer tools for debugging

## ✅ Deployment Checklist

- [ ] Contabo MySQL database running
- [ ] Database user created with proper permissions
- [ ] Vercel project connected to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Test authentication flow
- [ ] Verify admin panel access
- [ ] Test product browsing and cart functionality
- [ ] Monitor performance metrics

Your Walnut e-commerce application is now ready for production! 🎉
