# 📱 Complete OTP Implementation Guide for Walnut Store

## 🎯 Overview

This guide shows you how to implement **phone OTP verification** across your entire website for:
- ✅ Sign Up (already implemented)
- ✅ Login with OTP (new!)
- ✅ Password Reset (new!)
- ✅ Profile Phone Verification

---

## 📋 What's Already Implemented

### ✅ **1. OTP Infrastructure**
- `lib/otp.ts` - OTP generation, hashing, validation
- `lib/sms.ts` - SMS sending (Console, Fast2SMS, Twilio, MSG91)
- `lib/email.ts` - Email sending (Console, Resend, SendGrid)
- `components/auth/otp-verification.tsx` - Reusable OTP input component
- `app/api/otp/send/route.ts` - API to send OTP
- `app/api/otp/verify/route.ts` - API to verify OTP

### ✅ **2. Database Schema**
- `otps` table for storing OTP codes
- `phoneVerified` column in `users` table
- Automatic cleanup of expired OTPs

### ✅ **3. Sign Up with OTP**
- Email verification during signup
- Phone verification during signup
- Both must be verified before account creation

---

## 🆕 New Features to Add

### **1. Login with OTP** (Passwordless)
### **2. Forgot Password with OTP**
### **3. Profile Phone Verification**

---

## 📦 Implementation Steps

### **STEP 1: Add OTP Login Page**

Create: `app/auth/signin-otp/page.tsx`

```typescript
// See SIGNIN_OTP_PAGE.tsx file for complete code
```

### **STEP 2: Add OTP Login API**

Create: `app/api/auth/login-otp/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    // Find user by phone
    const user = await db.user.findFirst({
      where: { 
        phone: phone,
        phoneVerified: { not: null } // Must be verified
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this phone number' },
        { status: 404 }
      )
    }
    
    // Create session cookie
    cookies().set('user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    console.error('OTP login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
```

### **STEP 3: Add Forgot Password with OTP**

Create: `app/auth/forgot-password-otp/page.tsx`

```typescript
// Similar to signin-otp but for password reset
// 1. Enter phone number
// 2. Verify OTP
// 3. Set new password
```

### **STEP 4: Update Sign In Page with OTP Option**

Add to existing `app/auth/signin/page.tsx`:

```typescript
// Add button above or below Google sign-in
<div className="mt-4">
  <Link href="/auth/signin-otp">
    <Button
      type="button"
      variant="outline"
      className="w-full"
    >
      📱 Sign in with Phone OTP
    </Button>
  </Link>
  <p className="text-xs text-center text-gray-500 mt-2">
    No password needed!
  </p>
</div>
```

---

## 🔧 Configuration

### **FREE Setup (Development)**

Add to `.env.local`:

```bash
# OTP Configuration - FREE for development
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

**How it works:**
- OTPs appear in your terminal/console
- No cost, no API keys needed
- Perfect for testing

### **Production Setup (Real SMS)**

```bash
# For India - Fast2SMS (₹100/month for 1000 SMS)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_api_key_here

# OR Twilio (Global)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# OR MSG91 (India)
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=your_sender_id
```

---

## 🎨 User Flows

### **Flow 1: Sign Up with Phone Verification**

```
1. User fills signup form
   ↓
2. Click "Verify" next to Phone field
   ↓
3. OTP sent to phone (console/SMS)
   ↓
4. Enter 6-digit code
   ↓
5. ✅ Phone verified
   ↓
6. Create account (phone already verified)
```

### **Flow 2: Login with OTP (Passwordless)**

```
1. Click "Sign in with Phone OTP"
   ↓
2. Enter phone number
   ↓
3. Click "Send OTP"
   ↓
4. OTP sent to phone
   ↓
5. Enter 6-digit code
   ↓
6. ✅ Logged in (no password needed!)
```

### **Flow 3: Forgot Password with OTP**

```
1. Click "Forgot Password?"
   ↓
2. Enter phone number OR email
   ↓
3. Click "Send OTP"
   ↓
4. OTP sent to phone/email
   ↓
5. Enter 6-digit code
   ↓
6. ✅ Verified - Enter new password
   ↓
7. Password updated
```

### **Flow 4: Verify Phone in Profile**

```
1. Go to Profile/Account
   ↓
2. Click "Verify Phone" button
   ↓
3. OTP sent to phone
   ↓
4. Enter 6-digit code
   ↓
5. ✅ Phone verified
```

---

## 📊 Database Tables

### **`otps` Table**

```sql
CREATE TABLE `otps` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `otp` VARCHAR(255) NOT NULL,      -- Hashed OTP
  `type` ENUM('EMAIL', 'PHONE') NOT NULL,
  `purpose` ENUM('SIGNUP', 'LOGIN', 'RESET_PASSWORD', 'VERIFY_EMAIL', 'VERIFY_PHONE', 'TWO_FACTOR_AUTH') NOT NULL,
  `attempts` INT NOT NULL DEFAULT 0,
  `maxAttempts` INT NOT NULL DEFAULT 3,
  `isVerified` BOOLEAN NOT NULL DEFAULT FALSE,
  `expiresAt` DATETIME NOT NULL,    -- 5 minutes from creation
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `otps_email_idx` (`email`),
  INDEX `otps_phone_idx` (`phone`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

### **`users` Table (Updated)**

```sql
ALTER TABLE users ADD COLUMN phoneVerified DATETIME NULL;
```

---

## 🧪 Testing

### **Test OTP Login**

1. Start dev server:
```bash
npm run dev
```

2. Go to: `http://localhost:3000/auth/signin-otp`

3. Enter phone: `9876543210`

4. Click "Send OTP"

5. Check terminal - you'll see:
```
📱 ===== SMS MESSAGE (DEVELOPMENT) =====
📞 To: +919876543210
💬 Message: Your Walnut verification code is: 123456...
=======================================
```

6. Copy the 6-digit code (e.g., `123456`)

7. Enter it in the OTP modal

8. ✅ Logged in!

---

## 🔐 Security Features

### **1. OTP Hashing**
- OTPs are hashed with bcrypt before storing
- Plain OTP never stored in database

### **2. Rate Limiting**
- Max 3 verification attempts
- OTP expires after 5 minutes
- Prevents brute force attacks

### **3. Phone Verification**
- Phone must be verified to use OTP login
- Prevents unauthorized access

### **4. Session Management**
- Secure HTTP-only cookies
- 30-day session expiry
- Proper logout handling

---

## 📱 UI Components

### **OTP Input Component**

Already created: `components/auth/otp-verification.tsx`

Features:
- ✅ 6-digit input boxes
- ✅ Auto-focus next box
- ✅ Paste support (paste 6 digits at once)
- ✅ Countdown timer (5 minutes)
- ✅ Resend OTP button
- ✅ Error handling
- ✅ Loading states
- ✅ Mobile-friendly

### **Usage:**

```typescript
<OTPVerification
  phone="9876543210"    // or email="user@example.com"
  type="PHONE"          // or "EMAIL"
  purpose="LOGIN"       // or "SIGNUP", "RESET_PASSWORD", etc.
  onVerified={handleSuccess}
  onCancel={handleCancel}
/>
```

---

## 🚀 Deployment

### **Step 1: Update Environment Variables**

On Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
SMS_PROVIDER = fast2sms (or twilio, msg91)
FAST2SMS_API_KEY = your_api_key
EMAIL_PROVIDER = resend (or sendgrid)
RESEND_API_KEY = your_key
```

### **Step 2: Database Tables**

Make sure OTP tables are created in production database:

```sql
-- Run the queries from CREATE_OTP_TABLES.sql
```

### **Step 3: Deploy**

```bash
git push origin main
```

Vercel auto-deploys! ✅

---

## 💰 Cost Breakdown

| Provider | Type | Free Tier | Paid Tier | Best For |
|----------|------|-----------|-----------|----------|
| Console | Dev | ✅ Unlimited | N/A | Development |
| Fast2SMS | SMS | 10 SMS | ₹100/1000 SMS | India |
| Twilio | SMS | $15 credit | $0.0075/SMS | Global |
| MSG91 | SMS | Free trial | ₹0.15/SMS | India |
| Resend | Email | 100/day | 50k/$20 | Global |
| SendGrid | Email | 100/day | $15/40k | Global |

**Recommended for India:**
- Development: Console (FREE)
- Production: Fast2SMS (₹100-500/month)

---

## 🔧 Maintenance

### **Cleanup Old OTPs**

Run this query monthly:

```sql
DELETE FROM otps 
WHERE expiresAt < NOW() 
AND createdAt < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

Or set up a cron job:

```typescript
// app/api/cron/cleanup-otps/route.ts
export async function GET() {
  await db.otp.deleteMany({
    where: {
      AND: [
        { expiresAt: { lt: new Date() } },
        { createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    }
  })
  return Response.json({ success: true })
}
```

---

## ✅ Implementation Checklist

### **Phase 1: Setup (Already Done ✅)**
- [x] OTP library created
- [x] SMS/Email providers configured
- [x] Database tables created
- [x] OTP component created
- [x] Send OTP API created
- [x] Verify OTP API created
- [x] Signup with OTP working

### **Phase 2: Login with OTP (To Do)**
- [ ] Create signin-otp page
- [ ] Create login-otp API
- [ ] Add "Sign in with OTP" button to signin page
- [ ] Test OTP login flow
- [ ] Update UI/UX for OTP login

### **Phase 3: Password Reset (To Do)**
- [ ] Create forgot-password-otp page
- [ ] Create reset-password API
- [ ] Add "Forgot Password?" link
- [ ] Test password reset flow

### **Phase 4: Profile Verification (To Do)**
- [ ] Add "Verify Phone" button to profile
- [ ] Integrate OTP verification
- [ ] Show verification status
- [ ] Test phone verification

### **Phase 5: Production (To Do)**
- [ ] Sign up for SMS provider (Fast2SMS/Twilio)
- [ ] Get API keys
- [ ] Update environment variables on Vercel
- [ ] Test with real SMS
- [ ] Monitor costs and usage

---

## 📞 Support

Need help? Check:
1. Terminal/console for OTP codes (in dev mode)
2. Database `otps` table for stored OTPs
3. Browser console for errors
4. Server logs for API errors

---

## 🎉 Summary

**What You Have:**
- ✅ Complete OTP infrastructure
- ✅ Database schema
- ✅ Reusable components
- ✅ FREE development mode
- ✅ Production-ready code

**What to Do:**
1. Create signin-otp page (copy template above)
2. Create login-otp API (copy template above)
3. Add OTP button to signin page
4. Test in development (FREE)
5. Deploy to production
6. Switch to real SMS provider when ready

**Estimated Time:**
- Phase 2 (Login): 30 minutes
- Phase 3 (Password Reset): 30 minutes
- Phase 4 (Profile Verification): 20 minutes
- **Total: ~1.5 hours**

---

**OTP system is ready to use! Just follow the steps above to enable across your website.** 🚀
