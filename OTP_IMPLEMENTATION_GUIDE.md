# 📱 OTP Verification System - Complete Implementation Guide

## 🎯 Overview

This system provides **Email and Phone (SMS) OTP verification** for user signup, with support for multiple SMS/Email providers.

---

## ✅ What's Been Implemented

### 1. Database Schema (`prisma/schema.prisma`)
- ✅ `OTP` model with email/phone support
- ✅ `phoneVerified` field added to `User` model
- ✅ Enums: `OTPType` (EMAIL, PHONE) and `OTPPurpose` (SIGNUP, LOGIN, etc.)

### 2. Utility Functions
- ✅ `lib/otp.ts` - OTP generation, hashing, validation
- ✅ `lib/sms.ts` - SMS sending (Twilio, MSG91, Fast2SMS)
- ✅ `lib/email.ts` - Email sending (Resend, SendGrid)

### 3. API Routes
- ✅ `/api/otp/send` - Send OTP via email or SMS
- ✅ `/api/otp/verify` - Verify OTP code

### 4. UI Components
- ✅ `components/auth/otp-verification.tsx` - Beautiful OTP input modal
- ✅ Integrated into signup page with verify buttons

### 5. Features
- ✅ 6-digit OTP generation
- ✅ Rate limiting (1 minute between sends)
- ✅ 5-minute expiry
- ✅ 3 verification attempts
- ✅ Resend functionality with 60s cooldown
- ✅ Auto-submit when all digits entered
- ✅ Paste support
- ✅ Beautiful UI with timer and error messages

---

## 🚀 Setup Instructions

### Step 1: Database Migration

Run this migration to add the OTP table:

\`\`\`bash
npx prisma generate
npx prisma migrate dev --name add_otp_verification
\`\`\`

### Step 2: Choose SMS Provider

You have 4 options:

#### Option A: **Console Logging (Development)**
```bash
# .env.local
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```
✅ **Best for**: Testing without real SMS/email
✅ **Cost**: Free
✅ **Setup**: None needed - OTPs will appear in terminal

---

#### Option B: **Fast2SMS** (India - Recommended)
```bash
# .env.local
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_api_key_here
```

**Setup Steps:**
1. Sign up at https://www.fast2sms.com/
2. Complete KYC verification
3. Get API key from dashboard
4. Add credits (₹50 = ~500 SMS)

✅ **Best for**: Indian phone numbers
✅ **Cost**: ₹0.10 per SMS
✅ **Delivery**: Instant

---

#### Option C: **Twilio** (International)
```bash
# .env.local
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Setup Steps:**
1. Sign up at https://www.twilio.com/
2. Get free trial credits ($15)
3. Verify your phone number
4. Get credentials from console

✅ **Best for**: Worldwide coverage
✅ **Cost**: $0.0075 per SMS (India)
✅ **Delivery**: Instant

---

#### Option D: **MSG91** (India)
```bash
# .env.local
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=WALNUT
MSG91_FLOW_ID=your_flow_id
```

**Setup Steps:**
1. Sign up at https://msg91.com/
2. Complete KYC
3. Create SMS flow
4. Get auth key

✅ **Best for**: Bulk SMS in India
✅ **Cost**: ₹0.15 per SMS
✅ **Delivery**: Instant

---

### Step 3: Choose Email Provider

#### Option A: **Resend** (Recommended)
```bash
# .env.local
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM="Walnut <noreply@walnut.com>"
```

**Setup Steps:**
1. Sign up at https://resend.com/
2. Get API key (free tier: 100 emails/day)
3. Verify your domain (or use resend.dev for testing)

✅ **Best for**: Modern, simple API
✅ **Cost**: Free tier available
✅ **Delivery**: Instant

---

#### Option B: **SendGrid**
```bash
# .env.local
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@walnut.com
```

**Setup Steps:**
1. Sign up at https://sendgrid.com/
2. Create API key
3. Verify sender email

✅ **Best for**: Enterprise features
✅ **Cost**: Free tier (100 emails/day)
✅ **Delivery**: Instant

---

## 📱 How to Use

### Signup Flow

1. User fills in name, email, phone, password
2. User clicks **"Verify"** next to email field
3. OTP sent to email
4. User enters 6-digit code
5. ✅ Email verified!
6. User clicks **"Verify"** next to phone field
7. OTP sent via SMS
8. User enters 6-digit code
9. ✅ Phone verified!
10. User can now create account

### Features for Users

- **Timer**: Shows 5:00 countdown
- **Resend**: Available after 60 seconds
- **Auto-submit**: When all 6 digits entered
- **Paste support**: Ctrl+V/Cmd+V to paste code
- **Error messages**: Clear feedback
- **Attempts**: 3 attempts before new OTP needed

---

## 🔧 Testing

### Test in Development (Console Provider)

1. Set `SMS_PROVIDER=console` and `EMAIL_PROVIDER=console`
2. Run `npm run dev`
3. Sign up with test email/phone
4. Check terminal for OTP code:

```
📧 ===== EMAIL MESSAGE (DEVELOPMENT) =====
📬 To: test@example.com
📝 Subject: Your Walnut Verification Code: 123456
==========================================

📱 ===== SMS MESSAGE (DEVELOPMENT) =====
📞 To: +919876543210
💬 Message: Your Walnut verification code is: 123456...
=======================================
```

5. Enter the OTP shown in terminal
6. ✅ Verified!

### Test with Real SMS/Email

1. Configure real provider (Fast2SMS, Twilio, etc.)
2. Use your real phone number
3. You'll receive actual SMS/email
4. Enter OTP from message
5. ✅ Verified!

---

## 🎨 UI Preview

### Signup Page
```
┌────────────────────────────────────┐
│  Email address                     │
│  ┌─────────────────┬──────────┐   │
│  │ your@email.com  │ [Verify] │   │
│  └─────────────────┴──────────┘   │
│  ✓ Email verified successfully     │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Phone Number *                    │
│  ┌─────────────────┬──────────┐   │
│  │ 9876543210      │ [Verify] │   │
│  └─────────────────┴──────────┘   │
│  ✓ Phone verified successfully     │
└────────────────────────────────────┘
```

### OTP Verification Modal
```
┌────────────────────────────────────┐
│           📧                        │
│     Verify Your Email              │
│  We've sent a 6-digit code to     │
│     your@email.com                 │
│                                    │
│   ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐ │
│   │ 1 ││ 2 ││ 3 ││ 4 ││ 5 ││ 6 │ │
│   └───┘└───┘└───┘└───┘└───┘└───┘ │
│                                    │
│   Time remaining: 4:35             │
│                                    │
│   [  Verify OTP  ]                 │
│                                    │
│   Didn't receive the code?         │
│   Resend in 45s                    │
└────────────────────────────────────┘
```

---

## 🛡️ Security Features

1. **Hashed Storage**: OTPs are bcrypt-hashed in database
2. **Expiry**: Auto-expires after 5 minutes
3. **Attempt Limit**: Max 3 verification attempts
4. **Rate Limiting**: 1 minute cooldown between sends
5. **Unique Codes**: Cryptographically secure random generation
6. **Auto-Cleanup**: Old OTPs deleted when new one sent

---

## 📊 Database Structure

### `OTP` Table
```sql
id          String   @id @default(cuid())
userId      String?  -- Optional, for logged-in users
email       String?  -- For email OTP
phone       String?  -- For phone OTP
otp         String   -- Hashed OTP code
type        OTPType  -- EMAIL or PHONE
purpose     OTPPurpose -- SIGNUP, LOGIN, etc.
attempts    Int      @default(0)
maxAttempts Int      @default(3)
isVerified  Boolean  @default(false)
expiresAt   DateTime
createdAt   DateTime @default(now())
```

### `User` Model Updates
```sql
emailVerified  DateTime?  -- Timestamp when email verified
phoneVerified  DateTime?  -- Timestamp when phone verified (NEW)
otps           OTP[]      -- Relation to OTP records (NEW)
```

---

## 🔥 API Endpoints

### Send OTP
```typescript
POST /api/otp/send

Body:
{
  "email": "user@example.com",  // For EMAIL type
  "phone": "9876543210",         // For PHONE type
  "type": "EMAIL" | "PHONE",
  "purpose": "SIGNUP"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "otpId": "clxxx...",
  "expiresAt": "2024-01-01T12:05:00Z"
}
```

### Verify OTP
```typescript
POST /api/otp/verify

Body:
{
  "email": "user@example.com",  // For EMAIL type
  "phone": "9876543210",         // For PHONE type
  "otp": "123456",
  "type": "EMAIL" | "PHONE"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}

// Or on error:
{
  "error": "Invalid OTP. 2 attempts remaining.",
  "remainingAttempts": 2
}
```

---

## 🐛 Troubleshooting

### OTP Not Received (SMS)

**Fast2SMS:**
- ✅ Check if phone number is Indian (10 digits, starts with 6-9)
- ✅ Verify API key is correct
- ✅ Check Fast2SMS dashboard for delivery status
- ✅ Ensure you have credits

**Twilio:**
- ✅ Verify phone number is in E.164 format (+919876543210)
- ✅ Check if you've verified the recipient number (trial account)
- ✅ Check Twilio console for error messages

### OTP Not Received (Email)

- ✅ Check spam/junk folder
- ✅ Verify email provider credentials
- ✅ Check provider dashboard for delivery status
- ✅ Ensure sender email is verified

### OTP Expired

- ✅ OTPs expire after 5 minutes
- ✅ Click "Resend OTP" to get a new code

### Maximum Attempts Exceeded

- ✅ After 3 failed attempts, request a new OTP

---

## 💰 Cost Estimates

### For 1000 Signups/Month:

**SMS (Phone Verification):**
- Fast2SMS: ₹100 ($1.20)
- Twilio: $7.50
- MSG91: ₹150 ($1.80)

**Email (Email Verification):**
- Resend: Free (up to 3000/month)
- SendGrid: Free (up to 3000/month)

**Total Monthly Cost: ~₹100-200 ($1-3)**

---

## 🎯 Next Steps

1. ✅ Run database migration
2. ✅ Configure SMS/Email provider
3. ✅ Test in development (console provider)
4. ✅ Test with real phone number
5. ✅ Deploy to production
6. ✅ Monitor delivery rates in provider dashboard

---

## 📝 Notes

- **Development**: Use `console` provider to avoid costs
- **Production**: Use Fast2SMS (India) or Twilio (International)
- **Backup**: Configure both email and phone verification
- **Testing**: Always test with real devices before launch

---

## ✅ Checklist

- [ ] Database migration completed
- [ ] SMS provider configured
- [ ] Email provider configured
- [ ] Tested email OTP
- [ ] Tested phone OTP
- [ ] Tested resend functionality
- [ ] Tested error cases
- [ ] Tested on mobile device
- [ ] Production environment variables set

---

**🎉 You're all set! Users can now verify their email and phone during signup!**

