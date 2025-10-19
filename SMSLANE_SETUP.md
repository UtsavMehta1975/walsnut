# 📱 SMSLane OTP Setup Guide

## 🎯 **SMSLane - Affordable SMS for India**

**Website:** https://www.smslane.com/  
**Cost:** ₹0.10-0.15 per SMS (very affordable!)  
**Best For:** Indian phone numbers  

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Sign Up for SMSLane**

1. Visit: https://www.smslane.com/
2. Click "Sign Up" or "Register"
3. Fill registration form
4. Verify your email
5. Login to dashboard

---

### **Step 2: Get API Credentials**

Once logged in to SMSLane dashboard:

1. Go to **API Settings** or **Developers** section
2. Find your:
   - **API Key** (looks like: `xxxxxxxxxxxxx`)
   - **Client ID** (looks like: `123456`)
   - **Sender ID** (you can create one, e.g., `WALNUT`)

3. Copy these credentials

---

### **Step 3: Add to Local Environment**

Update your `.env.local` file:

```bash
# Change from console to smslane
SMS_PROVIDER=smslane

# Add SMSLane credentials
SMSLANE_API_KEY=your_api_key_here
SMSLANE_CLIENT_ID=your_client_id_here
SMSLANE_SENDER_ID=WALNUT
```

---

### **Step 4: Add to Vercel (Production)**

1. Go to: https://vercel.com
2. Your Project → Settings → Environment Variables
3. Add these variables:

```
Name: SMS_PROVIDER
Value: smslane

Name: SMSLANE_API_KEY
Value: your_api_key_here

Name: SMSLANE_CLIENT_ID
Value: your_client_id_here

Name: SMSLANE_SENDER_ID
Value: WALNUT
```

4. Save and redeploy

---

### **Step 5: Test It!**

1. Restart your dev server:
```bash
npm run dev
```

2. Visit: http://localhost:3000/auth/signin-otp

3. Enter phone: 9876543210

4. Click "Send OTP"

5. **Check your phone** - you should receive real SMS! 📱

6. Enter code → Logged in! ✅

---

## 💰 **Pricing**

| SMS Volume | Cost per SMS | Monthly Cost (100 SMS) |
|------------|--------------|------------------------|
| 0-1000 | ₹0.15 | ₹15 |
| 1000-5000 | ₹0.12 | ₹12 (per 100) |
| 5000+ | ₹0.10 | ₹10 (per 100) |

**Much cheaper than competitors!**

---

## 🔧 **API Configuration**

SMSLane requires:

```javascript
{
  SenderId: "WALNUT",           // Your approved sender ID
  Is_Unicode: false,            // English messages
  Is_Flash: false,              // Normal SMS (not flash)
  Message: "Your OTP is: 123456",
  MobileNumbers: "9876543210",  // 10-digit number
  ApiKey: "your_api_key",
  ClientId: "your_client_id"
}
```

**API Endpoint:** `https://www.smslane.com/api/v2/SendSMS`

---

## ✅ **Testing Checklist**

- [ ] Signed up on SMSLane.com
- [ ] Got API Key
- [ ] Got Client ID
- [ ] Created Sender ID (e.g., WALNUT)
- [ ] Added to `.env.local`
- [ ] Restarted dev server
- [ ] Tested signup OTP
- [ ] Received real SMS on phone
- [ ] Tested login OTP
- [ ] Received real SMS
- [ ] Added to Vercel env vars
- [ ] Deployed to production
- [ ] Tested on production

---

## 🐛 **Troubleshooting**

### **Issue: "API key not configured"**

**Fix:** Add `SMSLANE_API_KEY` to `.env.local`

---

### **Issue: "SMS failed"**

**Possible causes:**
1. Incorrect API key
2. Insufficient balance in SMSLane account
3. Sender ID not approved
4. Phone number format wrong

**Solution:**
- Check SMSLane dashboard for balance
- Verify API key is correct
- Check sender ID is approved
- Ensure phone is 10 digits (no +91)

---

### **Issue: "Not receiving SMS"**

**Check:**
1. Phone number is correct (10 digits)
2. SMSLane account has balance
3. Check SMSLane dashboard for delivery status
4. May take 10-30 seconds to receive
5. Check spam/blocked messages

---

## 🔄 **Switching from Console to SMSLane**

### **Current (FREE):**
```bash
SMS_PROVIDER=console
# OTPs appear in terminal (₹0 cost)
```

### **New (Real SMS):**
```bash
SMS_PROVIDER=smslane
SMSLANE_API_KEY=your_key
SMSLANE_CLIENT_ID=your_client_id
SMSLANE_SENDER_ID=WALNUT
# Real SMS sent to phone (₹0.10-0.15 per SMS)
```

**No code changes needed!** Just update environment variables.

---

## 📊 **Cost Comparison**

| Provider | Setup | Per SMS | 100 SMS/month | 1000 SMS/month |
|----------|-------|---------|---------------|----------------|
| Console | Free | ₹0 | ₹0 | ₹0 |
| **SMSLane** | **Free** | **₹0.10-0.15** | **₹10-15** | **₹100-150** |
| Fast2SMS | Free | ₹0.18-0.25 | ₹18-25 | ₹180-250 |
| MSG91 | Free | ₹0.15-0.20 | ₹15-20 | ₹150-200 |
| Twilio | Free | $0.0075 (~₹0.62) | ₹62 | ₹620 |

**SMSLane is the CHEAPEST option for India!** 🎯

---

## 🎉 **Summary**

**SMSLane is now integrated!** ✅

**To activate:**
1. Sign up on smslane.com
2. Get API credentials
3. Update environment variables
4. Restart server
5. Real SMS delivered! 📱

**Cost:** ~₹10-15 per 100 SMS (super affordable!)

---

## 🔗 **Useful Links**

- SMSLane Website: https://www.smslane.com/
- API Documentation: https://www.smslane.com/api-documentation
- Dashboard: https://www.smslane.com/login
- Support: support@smslane.com

---

**SMSLane integration complete! Just add your API keys and you're ready!** 🚀


