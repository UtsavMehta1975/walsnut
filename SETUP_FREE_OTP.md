# 🆓 FREE OTP Setup Guide - No Cost!

## ✅ Step 1: Configure FREE Providers

Add these lines to your `.env.local` file:

```bash
# OTP Configuration - FREE (Development Mode)
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

**What this does:**
- OTPs will appear in your terminal/console (not sent via real SMS/email)
- **100% FREE** - No API keys needed
- Perfect for development and low traffic

---

## ✅ Step 2: Create Database Tables Manually

### **Option A: Using phpMyAdmin / MySQL Workbench**

1. Open your MySQL database interface
2. Open the SQL editor
3. Copy and paste the contents of `CREATE_OTP_TABLES.sql`
4. Click "Execute" or "Run"
5. ✅ Done!

### **Option B: Using MySQL Command Line**

```bash
# Connect to your MySQL database
mysql -u your_username -p your_database_name

# Then paste the SQL from CREATE_OTP_TABLES.sql
# Or run the file directly:
mysql -u your_username -p your_database_name < CREATE_OTP_TABLES.sql
```

### **Option C: Using Railway/PlanetScale Dashboard**

1. Go to your database dashboard
2. Find "Query" or "Console" tab
3. Paste the SQL from `CREATE_OTP_TABLES.sql`
4. Click "Run Query"
5. ✅ Done!

---

## ✅ Step 3: Verify Tables Created

Run this query to check:

```sql
-- Check users table has phoneVerified column
DESCRIBE users;

-- Check OTP table exists
DESCRIBE otps;

-- Should show both tables
SHOW TABLES LIKE '%otp%';
```

You should see:
- `users` table with `phoneVerified` column
- `otps` table with all OTP fields

---

## 🧪 Step 4: Test It!

### **Start Your Dev Server:**

```bash
cd /Users/utsavmehta/Desktop/project/walnut/walsnut
npm run dev
```

### **Test Signup with OTP:**

1. Go to: http://localhost:3000/auth/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: test123
3. Click **"Verify"** button next to Email
4. **Look at your terminal/console** - you'll see:

```
📧 ===== EMAIL MESSAGE (DEVELOPMENT) =====
📬 To: test@example.com
📝 Subject: Your Walnut Verification Code: 123456
💬 Message: (full email HTML)
==========================================
```

5. Copy the **6-digit code** (e.g., `123456`)
6. Enter it in the OTP modal
7. ✅ **Email Verified!**
8. Click **"Verify"** next to Phone
9. **Check terminal again** - you'll see:

```
📱 ===== SMS MESSAGE (DEVELOPMENT) =====
📞 To: +919876543210
💬 Message: Your Walnut verification code is: 654321...
=======================================
```

10. Enter the **6-digit SMS code**
11. ✅ **Phone Verified!**
12. Create account - **Success!**

---

## 📊 Database Structure

### **`users` Table (Updated)**
```sql
| Column         | Type         | Description                    |
|----------------|--------------|--------------------------------|
| id             | VARCHAR(191) | Primary key                    |
| email          | VARCHAR(255) | User email                     |
| phone          | VARCHAR(20)  | User phone                     |
| emailVerified  | DATETIME     | Email verification timestamp   |
| phoneVerified  | DATETIME     | Phone verification timestamp ✨ NEW |
| ... (other existing columns)                                |
```

### **`otps` Table (New)**
```sql
| Column       | Type         | Description                      |
|--------------|--------------|----------------------------------|
| id           | VARCHAR(191) | Primary key                      |
| userId       | VARCHAR(191) | Foreign key to users (optional)  |
| email        | VARCHAR(255) | Email for verification           |
| phone        | VARCHAR(20)  | Phone for verification           |
| otp          | VARCHAR(255) | Hashed OTP code                  |
| type         | ENUM         | 'EMAIL' or 'PHONE'               |
| purpose      | ENUM         | 'SIGNUP', 'LOGIN', etc.          |
| attempts     | INT          | Failed verification attempts (0) |
| maxAttempts  | INT          | Max attempts allowed (3)         |
| isVerified   | BOOLEAN      | Verification status (false)      |
| expiresAt    | DATETIME     | Expiry time (5 min from creation)|
| createdAt    | DATETIME     | Creation timestamp               |
```

---

## 🔍 Monitoring & Debugging

### **View Recent OTPs:**
```sql
SELECT id, email, phone, type, attempts, isVerified, 
       expiresAt, createdAt 
FROM otps 
ORDER BY createdAt DESC 
LIMIT 10;
```

### **Check Terminal for OTP Codes:**

When using console provider, all OTPs appear in your terminal:

```
🔢 [OTP] Generated OTP: 123456
📤 Sending email via console to test@example.com
📧 ===== EMAIL MESSAGE (DEVELOPMENT) =====
...
```

Just copy the 6-digit code and use it!

---

## 💰 Cost Comparison

| Provider  | Mode       | Cost/Month (1000 signups) |
|-----------|------------|---------------------------|
| Console   | FREE       | ₹0 ($0) ✅ USING THIS     |
| Fast2SMS  | Production | ₹100 ($1.20)              |
| Twilio    | Production | $7.50                     |
| Resend    | Email FREE | ₹0 (free tier)            |

**You're using: ₹0/month! 🎉**

---

## 🚀 When You're Ready for Production

### **For Real SMS (India):**

1. Sign up: https://www.fast2sms.com/
2. Get API key
3. Update `.env.local`:
```bash
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_key_here
```

### **For Real Email:**

1. Sign up: https://resend.com/ (free tier: 100 emails/day)
2. Get API key
3. Update `.env.local`:
```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM="Walnut <noreply@walnut.com>"
```

---

## ⚠️ Important Notes

1. **Console mode is perfect for:**
   - Development
   - Testing
   - Low traffic (< 100 signups/day)
   - Demo purposes

2. **You should switch to real providers when:**
   - Going to production
   - High traffic expected
   - Want automated emails/SMS

3. **Database maintenance:**
   - Old expired OTPs will accumulate
   - Run cleanup query monthly:
   ```sql
   DELETE FROM otps 
   WHERE expiresAt < NOW() 
   AND isVerified = FALSE 
   AND createdAt < DATE_SUB(NOW(), INTERVAL 7 DAY);
   ```

---

## ✅ Checklist

- [ ] Added `SMS_PROVIDER=console` to `.env.local`
- [ ] Added `EMAIL_PROVIDER=console` to `.env.local`
- [ ] Ran SQL queries to create OTP table
- [ ] Verified `phoneVerified` column exists in users table
- [ ] Verified `otps` table exists
- [ ] Tested signup with email OTP
- [ ] Tested signup with phone OTP
- [ ] Saw OTP codes in terminal
- [ ] Successfully created account

---

## 🎉 You're All Set!

Your OTP system is now:
- ✅ Fully functional
- ✅ 100% FREE
- ✅ Ready for testing
- ✅ No API keys needed
- ✅ No credit card required

Just check your terminal for OTP codes during signup! 🚀

