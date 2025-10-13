# 🔴 URGENT: Google Login Not Working - Quick Fix

## Problem
Google login button clicks, shows loading, then stays on same page (no redirect).

## Root Cause
**Google Cloud Console Authorized Redirect URIs are NOT configured correctly.**

---

## ✅ IMMEDIATE FIX - Follow These Steps:

### Step 1: Go to Google Cloud Console

1. Open: **https://console.cloud.google.com/**
2. Select your project (the one with your Google Client ID)
3. Go to: **APIs & Services** → **Credentials**

### Step 2: Find Your OAuth 2.0 Client ID

1. Look for "OAuth 2.0 Client IDs" section
2. Click on your client ID (the one you're using for Walnut)

### Step 3: Add Authorized Redirect URIs

**CRITICAL:** You MUST add these EXACT URLs:

#### **For Production (Vercel):**
```
https://www.thewalnutstore.com/api/auth/callback/google
https://thewalnutstore.com/api/auth/callback/google
```

#### **For Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

**Screenshot of what it should look like:**
```
Authorized redirect URIs:
┌──────────────────────────────────────────────────────────────┐
│ https://www.thewalnutstore.com/api/auth/callback/google     │
│ https://thewalnutstore.com/api/auth/callback/google         │
│ http://localhost:3000/api/auth/callback/google              │
└──────────────────────────────────────────────────────────────┘
```

### Step 4: Save

Click **"SAVE"** at the bottom of the page.

⚠️ **Wait 1-2 minutes** for Google to propagate the changes.

### Step 5: Test Again

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Go to: https://www.thewalnutstore.com/auth/signup
3. Click "Continue with Google"
4. ✅ Should now redirect to Google login page
5. ✅ After login, redirects back to your site

---

## 🔍 How to Verify Current Settings

### Check Your Vercel Environment Variables:

1. Go to: https://vercel.com/dashboard
2. Click your project: **walsnut**
3. Go to: **Settings** → **Environment Variables**
4. Verify these are set:

```
NEXTAUTH_URL = https://www.thewalnutstore.com
NEXTAUTH_SECRET = (your secret)
GOOGLE_CLIENT_ID = (your ID).apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
```

⚠️ **IMPORTANT:** Make sure `NEXTAUTH_URL` does NOT have trailing slash!

✅ **Correct:** `https://www.thewalnutstore.com`  
❌ **Wrong:** `https://www.thewalnutstore.com/`

---

## 🐛 Still Not Working? Debug Steps:

### Step 1: Check Browser Console

1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Click "Continue with Google"
4. Look for errors

**Common errors:**

#### Error 1: "redirect_uri_mismatch"
```
Error 400: redirect_uri_mismatch
```

**Solution:** Add the redirect URI to Google Cloud Console (see Step 3 above)

#### Error 2: "idpiframe_initialization_failed"
```
Error: idpiframe_initialization_failed
```

**Solution:** Clear cookies and cache, try in incognito mode

#### Error 3: Network error
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

**Solution:** Disable ad blockers or try different browser

### Step 2: Check Network Tab

1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Click "Continue with Google"
4. Look for failed requests (red)

**What to look for:**
- Request to `/api/auth/signin/google` should return 302 redirect
- Redirect should go to `accounts.google.com`

### Step 3: Test in Incognito Mode

1. Open incognito/private window
2. Try Google login
3. If it works → Clear your main browser cache
4. If it doesn't work → Issue is with Google Cloud setup

---

## 📝 Complete Checklist

- [ ] Google Cloud Console → OAuth Client ID created
- [ ] Authorized redirect URIs added (3 URLs)
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 1-2 minutes for propagation
- [ ] Vercel env variables verified
- [ ] NEXTAUTH_URL has no trailing slash
- [ ] Cleared browser cache
- [ ] Tested in incognito mode

---

## 🎯 Quick Test Command

Run this to see what's happening:

```bash
# Test the Google OAuth endpoint
curl -I https://www.thewalnutstore.com/api/auth/signin/google
```

**Expected response:**
```
HTTP/2 302
location: https://accounts.google.com/o/oauth2/v2/auth?...
```

If you get `302` → Configuration is correct  
If you get `404` or `500` → Check Vercel deployment

---

## 💡 Alternative: Use Credentials Login

While fixing Google login, users can still sign up with email:

1. Go to signup page
2. Scroll down to "Or sign up with email"
3. Fill in the form
4. Works immediately ✅

---

## 🆘 Still Stuck? Share This Info:

If it's still not working, share these with me:

1. **Browser console errors** (F12 → Console tab)
2. **Network tab screenshot** (F12 → Network → click Google button)
3. **Google Cloud Console screenshot** (Authorized redirect URIs section)
4. **Vercel environment variables** (just confirm they're set, don't share values)

---

## ✅ Expected Behavior

**When working correctly:**

1. User clicks "Continue with Google"
2. Toast shows: "Redirecting to Google..."
3. Page redirects to: `accounts.google.com/o/oauth2/...`
4. User selects Google account
5. Google redirects to: `thewalnutstore.com/api/auth/callback/google`
6. User logged in and redirected to: `/dashboard`

---

## 🔒 Security Note

Your Google Client Secret is safe - it's only used server-side by Vercel. Never share it publicly.

---

**Fix this and Google login will work perfectly! 🚀**

