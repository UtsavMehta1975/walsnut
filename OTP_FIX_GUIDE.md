# 🔧 OTP Fix Guide - Make It Work

## ⚠️ Why OTP Might Not Be Working

### **Issue 1: Environment Variables Missing**

**Problem:** OTP system doesn't know which provider to use

**Solution:** Add these to `.env.local`:

```bash
# Add these TWO lines to .env.local
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

**How to add:**

1. Open `.env.local` file in your project root
2. Add the two lines above
3. Save file
4. Restart dev server: `npm run dev`

---

### **Issue 2: Database Tables Not Created**

**Problem:** `otps` table doesn't exist in database

**Solution:** Run SQL queries to create table

```sql
-- Check if table exists
SHOW TABLES LIKE '%otp%';

-- If not, create it using CREATE_OTP_TABLES.sql
```

See `CREATE_OTP_TABLES.sql` for complete SQL queries.

---

### **Issue 3: Phone Not Verified During Signup**

**Problem:** OTP login requires phone to be verified first

**Solution:** Users must verify phone during signup

**Flow:**
1. User goes to signup page
2. Enters phone number
3. Clicks "Verify" button next to phone field
4. Enters OTP
5. Phone verified ✅
6. Creates account
7. Can now use OTP login

---

## ✅ **Quick Fix Steps**

### **Step 1: Add Environment Variables**

Create or update `.env.local`:

```bash
# Database
MYSQL_URL="your_mysql_url_here"

# NextAuth
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_secret"

# 🆓 FREE OTP (Add these!)
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

---

### **Step 2: Restart Server**

```bash
# Kill current server (Ctrl+C)
# Start fresh
npm run dev
```

---

### **Step 3: Test OTP**

1. Visit: http://localhost:3000/auth/signup
2. Fill name, email, phone, password
3. Click "Verify" next to phone number
4. **Check terminal** - you'll see:

```
📱 ===== SMS MESSAGE (DEVELOPMENT) =====
📞 To: +919876543210
💬 Message: Your Walnut verification code is: 123456
```

5. Copy the 6-digit code (e.g., `123456`)
6. Enter in OTP popup
7. ✅ Phone verified!
8. Create account
9. Now you can use OTP login!

---

## 🐛 **Common OTP Errors & Fixes**

### **Error: "Failed to send OTP"**

**Cause:** Environment variables not set

**Fix:**
```bash
# Add to .env.local
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

---

### **Error: "OTP expired"**

**Cause:** More than 5 minutes passed

**Fix:** Click "Resend OTP" button (wait 1 minute between sends)

---

### **Error: "Invalid OTP"**

**Cause:** Wrong code entered

**Fix:** 
1. Check terminal for correct code
2. Make sure you copy all 6 digits
3. Try again (max 3 attempts)

---

### **Error: "No account found with this phone number"**

**Cause:** Trying to use OTP login but phone not verified

**Fix:**
1. Sign up first (with phone verification)
2. OR use password/Google login
3. Then verify phone in profile

---

## 🧪 **Testing Checklist**

- [ ] `.env.local` has `SMS_PROVIDER=console`
- [ ] `.env.local` has `EMAIL_PROVIDER=console`
- [ ] Server restarted after adding env vars
- [ ] Tested signup with phone verification
- [ ] Saw OTP code in terminal
- [ ] Successfully verified phone
- [ ] Created account
- [ ] Tested OTP login
- [ ] Saw OTP in terminal for login
- [ ] Successfully logged in with OTP

---

## 📊 **Database Check**

Run this in your MySQL console:

```sql
-- Check if otps table exists
SHOW TABLES LIKE '%otp%';

-- Check table structure
DESCRIBE otps;

-- Check if phoneVerified column exists in users
DESCRIBE users;

-- Check recent OTPs
SELECT id, phone, type, purpose, isVerified, expiresAt, createdAt 
FROM otps 
ORDER BY createdAt DESC 
LIMIT 5;
```

---

## 🚀 **If Still Not Working**

Send me these details:

1. **Console Error:** (Press F12 → Console tab)
2. **Terminal Output:** (Where npm run dev is running)
3. **What you see:** Screenshot of OTP screen
4. **What happens:** When you click "Send OTP"

I'll help you debug!

---

## ✅ **Expected Behavior**

### **Signup with OTP:**
1. Fill form → Click "Verify Phone"
2. Toast: "OTP sent to your phone!"
3. OTP popup opens
4. Check terminal → See 6-digit code
5. Enter code → "Phone verified!"
6. Create account → Success!

### **Login with OTP:**
1. Visit /auth/signin-otp
2. Enter phone number
3. Click "Send OTP"
4. Toast: "OTP sent!"
5. Check terminal → See code
6. Enter code → "Logged in!"

---

**Total time: 30 seconds per OTP** ⚡

If it's not working like this, check environment variables first!

