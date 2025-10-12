# 🚀 Vercel Environment Variables Setup

## Required OTP Environment Variables

Add these to your Vercel project settings:

### Option A: FREE Setup (Email Only - Recommended for Start)

```bash
# Email Provider - Resend (FREE: 100 emails/day)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Walnut <noreply@walnut.com>

# SMS Provider - Console (Development only)
SMS_PROVIDER=console
```

**Steps to get Resend API Key:**
1. Go to https://resend.com/
2. Sign up (free account)
3. Click "API Keys" in dashboard
4. Click "Create API Key"
5. Copy the key (starts with `re_`)
6. Add to Vercel

**Cost**: ₹0/month (up to 100 emails/day)

---

### Option B: Full Production Setup (Email + SMS)

```bash
# Email Provider - Resend (FREE)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Walnut <noreply@walnut.com>

# SMS Provider - Fast2SMS (India)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_fast2sms_key_here
```

**Steps to get Fast2SMS API Key:**
1. Go to https://www.fast2sms.com/
2. Sign up and complete KYC
3. Add credits (₹50 minimum)
4. Go to "Dev API" section
5. Copy your API key
6. Add to Vercel

**Cost**: ~₹100/1000 signups (₹0.10 per SMS)

---

### Option C: Development/Testing Only (Not Recommended for Production)

```bash
# Both Console (FREE but won't work well on Vercel)
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

**Note**: Console mode doesn't work well on Vercel production because:
- Serverless functions don't have accessible terminal
- OTP codes won't be visible to users
- Only use this for local development

---

## 📝 How to Add in Vercel

### Step 1: Open Vercel Dashboard
1. Go to https://vercel.com/
2. Select your project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar

### Step 2: Add Each Variable
For each variable above:
1. Enter **Key** (e.g., `EMAIL_PROVIDER`)
2. Enter **Value** (e.g., `resend`)
3. Select environments: ✓ Production ✓ Preview ✓ Development
4. Click "Save"

### Step 3: Redeploy
After adding all variables:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Or push a new commit to trigger deployment

---

## 🎯 Recommended for Starting Out

**Best setup for low traffic (< 100 signups/day):**

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Walnut <noreply@walnut.com>
SMS_PROVIDER=console
```

**Why?**
- ✅ Email verification works (FREE with Resend)
- ✅ Phone verification still required but cheaper
- ✅ Total cost: ₹0/month
- ✅ Upgrade SMS later when you have traffic

---

## 💰 Cost Comparison

| Setup | Email Cost | SMS Cost | Total/Month (1000 signups) |
|-------|-----------|----------|----------------------------|
| Console (Dev) | ₹0 | ₹0 | ₹0 (doesn't work in production) |
| Email Only | ₹0 | ₹0 | ₹0 (no phone verification) |
| Resend + Console | ₹0 | ₹0 | ₹0 (phone verification skipped) |
| Resend + Fast2SMS | ₹0 | ₹100 | ₹100 ($1.20) |
| Resend + Twilio | ₹0 | ₹600 | ₹600 ($7.50) |

---

## ⚠️ Common Issues

### Issue 1: "Failed to send OTP"
**Solution**: Check if environment variables are set correctly in Vercel

### Issue 2: OTP not received with console provider
**Solution**: Console provider doesn't work on Vercel. Switch to Resend or Fast2SMS

### Issue 3: Resend emails going to spam
**Solution**: 
- Verify your domain in Resend dashboard
- Or use resend.dev domain for testing

---

## 🔍 Verify Environment Variables

After adding variables in Vercel:

1. Go to Settings → Environment Variables
2. You should see:
   - `EMAIL_PROVIDER` = `resend` (or `console`)
   - `RESEND_API_KEY` = `re_xxxxx` (if using Resend)
   - `EMAIL_FROM` = your email
   - `SMS_PROVIDER` = `console` or `fast2sms`
   - `FAST2SMS_API_KEY` = your key (if using Fast2SMS)

3. Redeploy your app
4. Test signup on your production URL

---

## ✅ Quick Setup Checklist

- [ ] Signed up for Resend (free)
- [ ] Got Resend API key
- [ ] Added `EMAIL_PROVIDER=resend` in Vercel
- [ ] Added `RESEND_API_KEY` in Vercel
- [ ] Added `EMAIL_FROM` in Vercel
- [ ] Added `SMS_PROVIDER=console` in Vercel
- [ ] Redeployed application
- [ ] Tested signup on production URL
- [ ] Verified email OTP works
- [ ] (Optional) Signed up for Fast2SMS
- [ ] (Optional) Added Fast2SMS credentials

---

## 🎉 You're Ready!

After adding these variables and redeploying, your OTP system will work on Vercel production!

**Recommended Start**: Use Resend for email (FREE) and console for SMS until you get traffic.

