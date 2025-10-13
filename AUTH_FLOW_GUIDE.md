# 🔐 Walnut Store - Complete Authentication Flow Guide

## 🎯 Overview

Walnut Store supports **3 authentication methods**:
1. **Google OAuth** (Recommended - auto-registration)
2. **Email/Password** (Manual signup)
3. **Guest Checkout** (Auto-registration during purchase)

---

## 📱 User Journey: New User (First Time Visitor)

### **Scenario 1: New User Signs Up with Google** ⭐ RECOMMENDED

```
┌─────────────────────────────────────────────────────────┐
│ 1. User visits Walnut Store for the first time         │
│    - Clicks "Sign Up" or "Sign In"                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. User sees authentication options                     │
│    ✨ Option A: "Sign up with Google" (RECOMMENDED)    │
│    📧 Option B: Manual email signup                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. User clicks "Continue with Google"                   │
│    📱 Mobile: Full-page redirect to Google              │
│    💻 Desktop: Google OAuth popup                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. User signs in with Google account                    │
│    - Selects Google account                             │
│    - Grants permissions                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. SYSTEM: Checks if email exists in database           │
│    ❌ NOT FOUND → NEW USER!                             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. SYSTEM: Auto-creates account (PrismaAdapter)         │
│    ✅ Email: user@gmail.com                             │
│    ✅ Name: John Doe (from Google)                      │
│    ✅ Image: Profile pic (from Google)                  │
│    ✅ Role: CUSTOMER (auto-assigned)                    │
│    ✅ Email Verified: YES (Google verified)             │
│    ✅ Account Created: SUCCESS                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 7. SYSTEM: Creates session                              │
│    ✅ NextAuth session created                          │
│    ✅ Session saved to localStorage                     │
│    ✅ User authenticated                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 8. User redirected to homepage                          │
│    ✅ Fully logged in                                   │
│    ✅ Email visible in navbar                           │
│    ✅ Can browse and shop immediately                   │
│    ✅ Session persists across page reloads              │
└─────────────────────────────────────────────────────────┘
```

**Console Logs (Backend):**
```
🟢 [SIGNIN CALLBACK] Google provider detected
🟢 [SIGNIN CALLBACK] New Google user will be created by PrismaAdapter
🆕 [EVENT] New user account created in database: user@gmail.com
🆕 [EVENT] NEW USER detected! Auto-registering: user@gmail.com
✅ [EVENT] New user registered successfully!
✅ [EVENT] - Email: user@gmail.com
✅ [EVENT] - Name: John Doe
✅ [EVENT] - Role: CUSTOMER
✅ [EVENT] - Email verified: YES
✅ [EVENT] User can now browse the website!
```

**Console Logs (Frontend):**
```
📱 [GOOGLE] Mobile detected - using full page redirect
✅ [AUTH CONTEXT] NextAuth session detected: user@gmail.com
🔄 [AUTH CONTEXT] Updating user from NextAuth session
✅ User restored from session persistence: user@gmail.com
```

---

### **Scenario 2: New User Signs Up with Email/Password**

```
1. User fills signup form
   - Name
   - Email
   - Phone (optional)
   - Password

2. Clicks "Create Account"

3. SYSTEM: Validates input
   - Checks if email already exists
   - Validates password strength
   - Validates email format

4. SYSTEM: Creates account
   ✅ Hashes password (bcrypt)
   ✅ Stores in database
   ✅ Assigns CUSTOMER role
   ⚠️ Email NOT verified (needs verification)

5. SYSTEM: Auto-logs in user
   ✅ Creates session
   ✅ Redirects to homepage

6. User receives welcome
   ✅ Can browse immediately
   ⚠️ Email verification recommended
```

---

### **Scenario 3: New User Does Guest Checkout** 🛍️

```
1. User adds items to cart
   - No login required

2. Proceeds to checkout
   - Fills in shipping details
   - Enters email, name, phone, address

3. Completes payment
   - Enters payment info
   - Confirms order

4. SYSTEM: Checks if email exists
   ❌ NOT FOUND → NEW USER!

5. SYSTEM: Auto-creates account
   ✅ Email from checkout form
   ✅ Name from checkout form  
   ✅ Phone from checkout form
   ✅ Random password generated (can reset later)
   ✅ Role: CUSTOMER
   ✅ Order linked to new account

6. User receives confirmation
   ✅ Order placed successfully
   ✅ Account created automatically
   ℹ️ Can sign in with Google or reset password
```

**Toast Message:**
```
🎉 Account created! You can now sign in with Google or reset your password.
```

---

## 👤 User Journey: Existing User

### **Scenario 1: Existing User Signs In with Google**

```
1. User clicks "Sign in with Google"

2. Google OAuth flow

3. SYSTEM: Checks email
   ✅ FOUND → Existing user!

4. SYSTEM: Logs in
   ✅ Uses existing account
   ✅ Creates session
   ✅ No new account created

5. User redirected
   ✅ Logged in successfully
```

**Console Logs:**
```
🟢 [SIGNIN CALLBACK] Existing user, allowing sign in: user123
👋 [EVENT] Welcome back, existing user: user@gmail.com
```

---

### **Scenario 2: Existing User Signs In with Email/Password**

```
1. User enters email + password

2. SYSTEM: Validates credentials
   - Checks if user exists
   - Compares password hash

3. If valid:
   ✅ Creates session
   ✅ Saves to localStorage
   ✅ Redirects to homepage

4. If invalid:
   ❌ Shows error message
   ❌ User can retry or reset password
```

---

## 🔄 Account Linking & Merging

### **Same Email, Different Methods**

If user has account with email **user@gmail.com**:

**Scenario: Already signed up with Email, now uses Google**

```
1. User has account: user@gmail.com (email/password)
2. User clicks "Sign in with Google"
3. Selects same email: user@gmail.com
4. SYSTEM: Detects existing email
5. SYSTEM: Links Google account to existing user
   ✅ Same user record
   ✅ Can now login with both methods
```

**Setting: `allowDangerousEmailAccountLinking: true`**

This allows automatic account linking when:
- Email matches
- User confirms via OAuth
- Security verified by Google

---

## 🛡️ Security Features

### **Google OAuth**
✅ No password needed
✅ Email verified by Google
✅ 2FA if user has it on Google
✅ Secure OAuth 2.0 flow
✅ No password to leak/hack

### **Email/Password**
✅ Passwords hashed with bcrypt (10 rounds)
✅ Email validation
✅ Password strength requirements
✅ Secure session management
✅ Optional email verification

### **Guest Checkout**
✅ Random secure password generated
✅ User can reset password anytime
✅ Can link Google account later
✅ Order history preserved

---

## 📊 Database Schema

### **User Model**
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  phone           String?
  hashedPassword  String?   // Null for OAuth-only users
  image           String?   // Google profile pic
  role            Role      @default(CUSTOMER)
  emailVerified   DateTime? // Auto-set for Google users
  phoneVerified   DateTime? // Optional
  
  // Relations
  orders          Order[]
  accounts        Account[] // OAuth accounts (Google, etc.)
  sessions        Session[] // Active sessions
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### **Account Model** (NextAuth OAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth"
  provider          String  // "google"
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

---

## 🎯 User Roles

### **CUSTOMER** (Default)
- Can browse products
- Can add to cart
- Can place orders
- Can view order history
- Can manage profile

### **ADMIN**
- All CUSTOMER permissions
- Can access admin panel
- Can manage products
- Can view all orders
- Can manage users

**How to become ADMIN:**
- Must be manually upgraded in database
- Or use admin account (admin@walnut.com)

---

## 🔍 Session Management

### **Session Types**

1. **NextAuth Session** (Google OAuth)
   - JWT-based
   - 30 days expiry
   - Auto-refresh
   - Stored in HTTP-only cookie

2. **Custom Session** (Email/Password)
   - Cookie-based
   - localStorage backup
   - Manual refresh
   - Stored in cookies + localStorage

### **Session Persistence**

```typescript
// Auth Context checks (in order):
1. NextAuth session (useSession hook)
   ↓ If not found
2. localStorage session
   ↓ If not found
3. Custom API session
   ↓ If none found
4. User is logged out
```

---

## 🧪 Testing the Flow

### **Test as New User**

1. **Open incognito window**
2. **Visit:** https://www.thewalnutstore.com/auth/signup
3. **Click:** "Continue with Google"
4. **Use new email** (or email not in system)
5. **Complete Google OAuth**
6. **Check:**
   - ✅ Redirected to homepage
   - ✅ Email visible in navbar
   - ✅ Can browse products
   - ✅ Refresh page → still logged in

7. **Open browser console (F12)**
8. **Look for logs:**
   ```
   🆕 [EVENT] NEW USER detected! Auto-registering
   ✅ [EVENT] New user registered successfully!
   ```

### **Test as Existing User**

1. **Use same email as before**
2. **Click "Sign in with Google"**
3. **Check logs:**
   ```
   👋 [EVENT] Welcome back, existing user
   ```

---

## 🐛 Troubleshooting

### **"No active session found" after Google login**

**Solution:** Already fixed! ✅
- Now uses `useSession` hook
- Auto-detects session changes
- Updates auth context immediately

### **Mobile Google login not working**

**Solution:** Already fixed! ✅
- Auto-detects mobile devices
- Uses full-page redirect on mobile
- Uses popup on desktop

### **Account not created**

**Check:**
1. Browser console for errors
2. Server logs for database errors
3. NEXTAUTH_URL environment variable
4. Google OAuth redirect URIs

---

## 📝 Summary

✅ **New users** can sign up instantly with Google (recommended)
✅ **Accounts auto-created** when using Google for first time
✅ **Email verified** automatically for Google users
✅ **Guest checkout** creates account automatically
✅ **Existing users** sign in seamlessly
✅ **Account linking** works for same email across methods
✅ **Session persists** across page reloads
✅ **Mobile & desktop** both work perfectly

**The authentication flow is complete, robust, and user-friendly!** 🎉

