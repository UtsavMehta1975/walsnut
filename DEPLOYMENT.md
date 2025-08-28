# 🚀 Vercel Deployment Guide for Walnut

This guide will help you deploy your Walnut e-commerce website to Vercel.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up a MySQL database (Railway, PlanetScale, or similar)

## 🔧 Step 1: Database Setup

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a MySQL database
4. Copy the connection string

### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string

### Option C: Local MySQL
1. Install MySQL locally
2. Create a database named `walnut_db`
3. Use connection string: `mysql://username:password@localhost:3306/walnut_db`

## 🌐 Step 2: Deploy to Vercel

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"

### 2. Import Repository
1. Select your `walsnut` repository
2. Vercel will auto-detect Next.js settings
3. Click "Import"

### 3. Configure Environment Variables
Add these environment variables in Vercel:

```env
# Database
MYSQL_URL="your-mysql-connection-string"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 4. Optional Environment Variables
```env
# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

### 5. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-domain.vercel.app`

## 🗄️ Step 3: Database Migration

After deployment, you need to set up your database:

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Run database migration
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Option B: Using Database Provider Dashboard
1. Go to your database provider dashboard
2. Run the SQL commands from `prisma/schema.prisma`
3. Or use Prisma Studio: `npx prisma studio`

## 🔐 Step 4: Authentication Setup

### Generate NEXTAUTH_SECRET
```bash
# Generate a secure secret
openssl rand -base64 32
```

### Update Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXTAUTH_SECRET` with the generated value
3. Update `NEXTAUTH_URL` with your Vercel domain

## 🎨 Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## 🔧 Step 6: Post-Deployment Setup

### 1. Create Admin User
1. Go to your deployed site
2. Sign up with an email
3. Manually update the user role to 'ADMIN' in your database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 2. Add Products
1. Go to `/admin` on your site
2. Add products using the admin panel
3. Upload images using image URLs

### 3. Test Functionality
- [ ] User registration/login
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Admin panel
- [ ] Order management

## 🚨 Troubleshooting

### Build Errors
1. Check Vercel build logs
2. Ensure all environment variables are set
3. Verify database connection

### Database Connection Issues
1. Check `MYSQL_URL` format
2. Ensure database is accessible from Vercel
3. Verify database credentials

### Authentication Issues
1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your domain
3. Ensure database tables are created

### Image Loading Issues
1. Check image URLs are accessible
2. Verify Next.js image configuration
3. Test with different image sources

## 📱 Performance Optimization

### 1. Enable Vercel Analytics
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Web Analytics

### 2. Configure Caching
The project includes:
- Image optimization
- API response caching
- Static asset caching

### 3. Monitor Performance
- Use Vercel Analytics
- Check Core Web Vitals
- Monitor API response times

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Review environment variables
3. Test locally first
4. Check database connectivity

## 🎉 Success!

Your Walnut e-commerce website is now live on Vercel! 

**Next Steps:**
1. Add products through admin panel
2. Test all functionality
3. Set up custom domain
4. Configure analytics
5. Set up monitoring

---

**Happy Selling! 🛍️**
