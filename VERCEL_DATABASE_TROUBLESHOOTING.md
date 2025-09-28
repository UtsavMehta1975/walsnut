# 🔧 Vercel Database Troubleshooting Guide

## 🚨 PrismaClientInitializationError Fix

The error `PrismaClientInitializationError` in Vercel usually means there's an issue with the database connection or environment variables.

### 🔍 Common Causes:

1. **Missing Environment Variables**
2. **Incorrect Database URL Format**
3. **Database Server Not Accessible**
4. **Prisma Client Not Generated**

### ✅ Step-by-Step Fix:

#### **1. Check Environment Variables in Vercel**

Go to Vercel Dashboard → Project Settings → Environment Variables and verify these are set:

```env
MYSQL_URL=mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=a6l15TQlu9p8qpFB+wLMj35R583D1df6Wu71+fyw+PU=
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

#### **2. Verify Database Connection**

Test your database connection from your local machine:

```bash
# Test connection (replace with your actual password)
mysql -h 185.196.21.112 -u utsav -p walnut_db
```

#### **3. Check Database Server Status**

Make sure your Contabo MySQL server is:
- ✅ Running and accessible
- ✅ Port 3306 is open
- ✅ User `utsav` has proper permissions
- ✅ Database `walnut_db` exists

#### **4. Update Vercel Environment Variables**

**Important:** Replace these values with your actual ones:

```env
# Replace 'YourStrongPassword' with your actual database password
MYSQL_URL=mysql://utsav:YOUR_ACTUAL_PASSWORD@185.196.21.112:3306/walnut_db

# Replace 'your-vercel-app.vercel.app' with your actual Vercel domain
NEXTAUTH_URL=https://your-actual-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

#### **5. Redeploy After Environment Changes**

After updating environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete

### 🔧 Quick Fix Commands

If you need to regenerate Prisma client:

```bash
# Local development
npx prisma generate
npx prisma db push

# Check environment variables
echo $MYSQL_URL
```

### 🚨 Emergency Fix

If the issue persists, try this quick fix:

#### **1. Clear Vercel Build Cache:**
1. Go to Vercel Dashboard → Settings → Functions
2. Click "Clear Build Cache"
3. Redeploy

#### **2. Force Prisma Generation:**
Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && next build"
  }
}
```

#### **3. Check Vercel Build Logs:**
1. Go to Vercel Dashboard → Deployments
2. Click on the failed deployment
3. Check the build logs for specific errors

### 📊 Database Connection Test

Create a test endpoint to verify database connection:

```typescript
// app/api/test-db/route.ts
import { db } from '@/lib/db'

export async function GET() {
  try {
    await db.$connect()
    const result = await db.$queryRaw`SELECT 1 as test`
    await db.$disconnect()
    return Response.json({ success: true, result })
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message,
      env: {
        hasMysqlUrl: !!process.env.MYSQL_URL,
        mysqlUrlPrefix: process.env.MYSQL_URL?.substring(0, 20) + '...'
      }
    })
  }
}
```

### 🎯 Most Likely Solutions:

#### **Solution 1: Environment Variables**
- ✅ Double-check `MYSQL_URL` format
- ✅ Verify password is correct
- ✅ Ensure all variables are set in Vercel

#### **Solution 2: Database Access**
- ✅ Check if Contabo server allows external connections
- ✅ Verify MySQL user permissions
- ✅ Test connection from another machine

#### **Solution 3: Prisma Client**
- ✅ Regenerate Prisma client
- ✅ Clear Vercel build cache
- ✅ Redeploy with fresh build

### 🚀 After Fixing:

Once the database connection is working:

1. **Test Categories API**: `/api/categories`
2. **Test Signup**: `/auth/signup` with phone number
3. **Test Login**: `/auth/signin`
4. **Test Checkout**: Add items and go to checkout

### 📞 Still Having Issues?

If the problem persists:

1. **Check Vercel Build Logs** for specific error messages
2. **Verify Database Server** is accessible from internet
3. **Test Database Connection** from external IP
4. **Contact Contabo Support** if server issues

---

## 🎉 Expected Result

After fixing the environment variables and redeploying:
- ✅ Categories API will work
- ✅ Phone number signup will work
- ✅ Checkout system will work
- ✅ All database operations will work

**The key is ensuring the `MYSQL_URL` environment variable is correctly set in Vercel!** 🔑
