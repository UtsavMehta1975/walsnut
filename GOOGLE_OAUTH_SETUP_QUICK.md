# 🚀 Quick Google OAuth Setup Guide

## 🔴 ISSUE: Google Login Not Working

Your Google OAuth credentials are currently **placeholder values**:
```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"  ❌
GOOGLE_CLIENT_SECRET="your-google-client-secret"  ❌
```

## ✅ Fix in 5 Minutes:

### Step 1: Visit Debug Page
Go to: **http://localhost:3000/debug-oauth**

This page will show you:
- ✅ What's configured correctly
- ❌ What needs to be fixed
- 🧪 Test button to try Google login

### Step 2: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - URL: https://console.cloud.google.com/

2. **Select or Create Project**
   - Click project dropdown at top
   - Click "New Project" or select existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure OAuth consent screen:
     - User type: External
     - App name: "Walnut Store"
     - Support email: your email
     - Add your domain (if you have one)
     - Scopes: Just the default ones are fine
     - Test users: Add your Gmail address

5. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: "Walnut Store - Local Development"
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

6. **Copy Credentials**
   - You'll see your Client ID and Client Secret
   - Keep this tab open!

### Step 3: Update .env.local

1. Open `.env.local` in your project
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID="123456789-abc123defg456hijklmn.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-ABCdefGHIjklMNOpqrsTUVwxyz"
```

**IMPORTANT**: 
- Client ID ends with `.apps.googleusercontent.com`
- Client Secret starts with `GOCSPX-`

### Step 4: Restart Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Test It!

1. Go to: http://localhost:3000/debug-oauth
2. Check all items show ✅ green
3. Click "Test Google Sign-In"
4. Should redirect to Google
5. Authorize the app
6. Should redirect back and show your Google profile

---

## 📋 Current Status Check

Run these to verify:

```bash
# Check if credentials are set
cat .env.local | grep GOOGLE

# Should show something like:
# GOOGLE_CLIENT_ID="123456789-..."  ✅
# GOOGLE_CLIENT_SECRET="GOCSPX-..."  ✅

# NOT like:
# GOOGLE_CLIENT_ID="your-google-client-id..."  ❌
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "redirect_uri_mismatch"
**Problem**: Redirect URI doesn't match Google Console
**Solution**: 
- Go to Google Console → Credentials
- Edit OAuth client
- Make sure redirect URI is EXACTLY: `http://localhost:3000/api/auth/callback/google`
- No trailing slash!

### Issue 2: "access_denied"
**Problem**: User denied permission OR app not approved
**Solution**:
- Try again and click "Allow" when Google asks
- If in production mode, add yourself as test user in OAuth consent screen

### Issue 3: "Invalid client"
**Problem**: Client ID or Secret is wrong
**Solution**:
- Double-check you copied the entire ID and Secret
- No extra spaces or quotes
- Make sure you're using credentials from the correct project

### Issue 4: Still shows placeholder values
**Problem**: Server not restarted or wrong file edited
**Solution**:
- Stop server completely (Ctrl+C)
- Verify `.env.local` file (not `.env`)
- Start server again: `npm run dev`
- Check http://localhost:3000/debug-oauth

---

## 🧪 Testing Checklist

After setup, test these scenarios:

- [ ] Debug page shows all ✅ green checkmarks
- [ ] Click "Sign in with Google" redirects to Google
- [ ] Can see consent screen asking for permissions
- [ ] After authorizing, redirects back to your site
- [ ] User is logged in (check navbar)
- [ ] Profile picture shows up (if you have one on Google)
- [ ] Can navigate to /orders and see empty state
- [ ] Can sign out
- [ ] Can sign in again (should be instant, no consent screen)

---

## 📝 Debug Page Features

The debug page at `/debug-oauth` shows:

1. **Current Session Status**
   - Whether you're logged in
   - Your user details
   - Session data

2. **Environment Configuration**
   - All OAuth variables
   - Valid/Invalid status
   - What needs to be fixed

3. **Action Required Alert**
   - Shows if credentials are missing
   - Step-by-step setup instructions
   - Example values

4. **Test Button**
   - One-click test of OAuth flow
   - Disabled until credentials are valid
   - Console logs for debugging

5. **Console Log Guide**
   - What to look for in DevTools
   - Example of successful flow
   - How to identify errors

---

## 🚀 Production Setup

When deploying to production:

1. **Create Production OAuth Client**
   - Same steps as above
   - Use production domain
   - Redirect URI: `https://yourdomain.com/api/auth/callback/google`

2. **Update Environment Variables**
   - In Vercel/your hosting: Settings → Environment Variables
   - Add:
     - `GOOGLE_CLIENT_ID` (production value)
     - `GOOGLE_CLIENT_SECRET` (production value)
     - `NEXTAUTH_URL` = `https://yourdomain.com`
     - `NEXTAUTH_SECRET` (generate new random string)

3. **Update OAuth Consent Screen**
   - Change from "Testing" to "In Production"
   - Add privacy policy URL
   - Add terms of service URL

---

## 💡 Tips

1. **Keep Credentials Secret**
   - Never commit `.env.local` to git
   - Use different credentials for dev/prod
   - Rotate secrets regularly

2. **Use Debug Page**
   - Check it whenever OAuth isn't working
   - Share screenshot if asking for help
   - Test button shows exact error

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for 🟢/🔴 log messages
   - Copy error messages if any

4. **Database Migration**
   - Make sure to run: `npx prisma db push`
   - OAuth won't work without proper database tables

---

## 📞 Still Not Working?

1. Visit: http://localhost:3000/debug-oauth
2. Take screenshot of the page
3. Open browser console (F12)
4. Click "Test Google Sign-In"
5. Copy any error messages

The debug page will tell you exactly what's wrong!

---

**Last Updated**: October 12, 2025
**Status**: Credentials need to be configured
**Next Step**: Follow Step 2 above to get Google OAuth credentials

