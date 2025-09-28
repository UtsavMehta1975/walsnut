# 🔧 Vercel Environment Variables Update

## 🚀 Updated Environment Variables for Vercel

Since we've added new database fields and updated the schema, you need to update your Vercel environment variables.

### 📋 Required Environment Variables for Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add/update these:

#### **Database Connection:**
```env
MYSQL_URL=mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db
```

#### **NextAuth Configuration:**
```env
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=a6l15TQlu9p8qpFB+wLMj35R583D1df6Wu71+fyw+PU=
```

#### **Application Configuration:**
```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### 🔄 Database Schema Changes

The database now includes these new fields:

#### **User Model:**
- ✅ **phone** field added (optional)
- ✅ Phone numbers are stored for SMS notifications

#### **Order Model:**
- ✅ **paymentStatus** field (PENDING, PROCESSING, COMPLETED, FAILED, etc.)
- ✅ **paymentMethod** field (UPI, Card, Net Banking, etc.)
- ✅ **paymentTransactionId** field (for payment gateway tracking)
- ✅ **paymentGateway** field (Razorpay, PayU, etc.)
- ✅ **paymentAmount** field (actual payment amount)
- ✅ **paymentCurrency** field (default: INR)
- ✅ **paymentCompletedAt** field (timestamp)

### 📊 Environment Variables Checklist

**✅ Required for Production:**
- [ ] `MYSQL_URL` - Database connection string
- [ ] `NEXTAUTH_URL` - Your Vercel app URL
- [ ] `NEXTAUTH_SECRET` - Strong secret key
- [ ] `NEXT_PUBLIC_APP_URL` - Public app URL
- [ ] `NODE_ENV` - Set to "production"

**🔧 Optional (for future features):**
- [ ] `CLOUDINARY_CLOUD_NAME` - For image uploads
- [ ] `CLOUDINARY_API_KEY` - For image uploads
- [ ] `CLOUDINARY_API_SECRET` - For image uploads
- [ ] `PAYMENT_GATEWAY_API_KEY` - For payment integration
- [ ] `PAYMENT_GATEWAY_SECRET` - For payment integration

### 🚀 Steps to Update Vercel Environment Variables

#### **1. Access Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your project
4. Go to **Settings** → **Environment Variables**

#### **2. Add/Update Variables:**
```
Name: MYSQL_URL
Value: mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db
Environment: Production, Preview, Development

Name: NEXTAUTH_URL
Value: https://your-vercel-app.vercel.app
Environment: Production, Preview, Development

Name: NEXTAUTH_SECRET
Value: a6l15TQlu9p8qpFB+wLMj35R583D1df6Wu71+fyw+PU=
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_APP_URL
Value: https://your-vercel-app.vercel.app
Environment: Production, Preview, Development

Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

#### **3. Redeploy:**
After updating environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

### 🔍 Verification Steps

After deployment, verify these features work:

#### **✅ Phone Number Signup:**
1. Go to `/auth/signup`
2. Fill the form including phone number
3. Verify account creation works
4. Check phone number is stored in database

#### **✅ Login with Phone Data:**
1. Login with created account
2. Verify phone number is returned in user data
3. Check authentication works properly

#### **✅ Checkout System:**
1. Add items to cart
2. Go to checkout
3. Fill shipping information
4. Verify order creation works
5. Check payment fields are ready for gateway integration

#### **✅ Database Schema:**
1. Verify new fields exist in database
2. Check phone field in users table
3. Check payment fields in orders table
4. Verify data types are correct

### 🐛 Troubleshooting

#### **If deployment fails:**
1. Check environment variables are correctly set
2. Verify database connection string format
3. Ensure all required variables are present
4. Check Vercel build logs for specific errors

#### **If authentication fails:**
1. Verify `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is properly set
3. Ensure database connection is working
4. Check for any JWT errors in logs

#### **If database errors occur:**
1. Verify `MYSQL_URL` is correct
2. Check database server is accessible
3. Ensure database exists and user has permissions
4. Verify Prisma schema is up to date

### 📞 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Review error messages carefully

---

## 🎉 Ready for Production!

After updating the environment variables:
- ✅ Phone number signup will work
- ✅ Payment-ready checkout system
- ✅ Enhanced user data storage
- ✅ Ready for payment gateway integration
- ✅ Optimized authentication flow

**Your app is now ready for production with all new features!** 🚀
