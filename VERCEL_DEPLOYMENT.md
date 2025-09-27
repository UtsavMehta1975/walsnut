# 🚀 Vercel Deployment Guide with Contabo MySQL

This guide will help you deploy your Walnut e-commerce website to Vercel using your Contabo MySQL database.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Contabo MySQL Database**: Set up and running on your server

## 🗄️ Step 1: Set Up Contabo MySQL Database

### 1.1 Connect to Your Contabo Server
```bash
ssh root@185.196.21.112
```

### 1.2 Install and Configure MySQL
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

### 1.3 Configure Firewall (Optional but Recommended)
```bash
# Allow MySQL port
ufw allow 3306

# Allow SSH
ufw allow 22

# Enable firewall
ufw enable
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"

### 2.2 Import Repository
1. Select your `walsnut` repository
2. Vercel will auto-detect Next.js settings
3. Click "Import"

### 2.3 Configure Environment Variables
Add these environment variables in Vercel:

```env
# Database - Contabo MySQL
MYSQL_URL="mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Production
NODE_ENV="production"
```

### 2.4 Optional Environment Variables
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

### 2.5 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-domain.vercel.app`

## 🗄️ Step 3: Database Migration

### 3.1 Run Prisma Migrations
After deployment, you need to set up your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed the database
npm run db:seed
```

### 3.2 Verify Database Connection
Test the connection from your local machine:

```bash
mysql -h 185.196.21.112 -u utsav -pYourStrongPassword -e "SHOW DATABASES;"
```

## 🔧 Step 4: Local Development Setup

### 4.1 Set Up Local MySQL
```bash
# Run the local setup script
./setup-local-mysql.sh

# Copy environment template
cp env-local.example .env.local

# Update .env.local with your actual password
# Edit .env.local and change "YourStrongPassword" to your actual password
```

### 4.2 Start Development
```bash
# Generate Prisma client
npx prisma generate

# Push schema to local database
npx prisma db push

# Start development server
npm run dev
```

## 🔒 Security Considerations

### 4.1 Database Security
1. **Change Default Password**: Replace `YourStrongPassword` with a strong password
2. **Firewall Configuration**: Restrict database access to necessary IPs
3. **SSL Connection**: Consider enabling SSL for database connections

### 4.2 Environment Variables
1. **Never commit `.env.local`** to version control
2. **Use different passwords** for development and production
3. **Rotate secrets regularly**

## 📊 Database Connection Details

### Local Development
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `walnut_db`
- **Username**: `utsav`
- **Password**: `YourStrongPassword`

### Production (Vercel)
- **Host**: `185.196.21.112`
- **Port**: `3306`
- **Database**: `walnut_db`
- **Username**: `utsav`
- **Password**: `YourStrongPassword`

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL is running on the server
   - Verify firewall settings
   - Check bind-address configuration

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions
   - Ensure user can connect from remote hosts

3. **Database Not Found**
   - Create the database manually
   - Check database name in connection string

### Useful Commands

```bash
# Check MySQL status on server
systemctl status mysql

# Check MySQL configuration
cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep bind-address

# Test database connection
mysql -h 185.196.21.112 -u utsav -pYourStrongPassword -e "SELECT 1;"

# Check user permissions
mysql -h 185.196.21.112 -u utsav -pYourStrongPassword -e "SHOW GRANTS;"
```

## ✅ Deployment Checklist

- [ ] Contabo MySQL database set up and running
- [ ] Database user created with proper permissions
- [ ] Remote access configured
- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Prisma migrations run on production database
- [ ] Local development environment set up
- [ ] Database connection tested from both local and production

## 🎉 You're Ready!

Your Walnut e-commerce website is now deployed to Vercel with your Contabo MySQL database. You can:

1. **Develop locally** using your local MySQL database
2. **Deploy to production** using your Contabo MySQL database
3. **Scale your application** as needed

Happy coding! 🚀
