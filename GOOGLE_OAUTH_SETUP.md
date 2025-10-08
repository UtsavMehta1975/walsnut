# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication with NextAuth.js in your Walnut Store application.

## Prerequisites

- A Google Cloud Platform account
- Access to your database server
- Node.js and npm installed

## Table of Contents

1. [Google Cloud Console Setup](#google-cloud-console-setup)
2. [Environment Variables](#environment-variables)
3. [Database Migration](#database-migration)
4. [Testing Google Sign-In](#testing-google-sign-in)
5. [Troubleshooting](#troubleshooting)

---

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter your project name (e.g., "Walnut Store")
5. Click "Create"

### Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Walnut Store
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Add scopes:
   - `openid`
   - `email`
   - `profile`
6. Add test users (optional, for development)
7. Click "Save and Continue"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Configure the OAuth client:
   
   **For Development:**
   - **Name**: Walnut Store - Development
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/api/auth/callback/google`
   
   **For Production:**
   - **Name**: Walnut Store - Production
   - **Authorized JavaScript origins**: 
     - `https://www.thewalnutstore.com`
     - `https://thewalnutstore.com`
   - **Authorized redirect URIs**: 
     - `https://www.thewalnutstore.com/api/auth/callback/google`
     - `https://thewalnutstore.com/api/auth/callback/google`

5. Click "Create"
6. Copy the **Client ID** and **Client Secret** (you'll need these in the next step)

**Note**: You can create separate OAuth clients for development and production, or use the same one with multiple authorized URIs.

---

## Environment Variables

### Local Development

Add these variables to your `.env.local` file:

```env
# Google OAuth (for NextAuth)
GOOGLE_CLIENT_ID="your-actual-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

### Production (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the following variables:
   - `GOOGLE_CLIENT_ID`: Your production Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your production Google Client Secret

**Important**: Use different OAuth clients for development and production for better security.

---

## Database Migration

The database schema already includes the necessary models for Google OAuth:
- `Account` - Stores OAuth account information
- `Session` - Stores user sessions
- `VerificationToken` - For email verification
- `User` model updated with:
  - `image` field for profile picture
  - `hashedPassword` is now optional (for OAuth users)
  - `emailVerified` field
  - Relations to `accounts` and `sessions`

### Run the Migration

When your database server is accessible, run:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_google_oauth_support

# Or if already in production, use:
npx prisma migrate deploy
```

### Migration Details

The migration will create the following tables if they don't exist:
- `accounts` - OAuth provider accounts
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens

And update the `users` table with:
- `image` field (VARCHAR)
- `emailVerified` field (DATETIME)
- Make `hashedPassword` optional

---

## Testing Google Sign-In

### Development Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/signin`

3. You should see:
   - Traditional email/password login form
   - "Or continue with" divider
   - "Sign in with Google" button

4. Click the Google button to test the OAuth flow

5. After successful authentication:
   - First-time users will be created in your database
   - Existing users (by email) will be linked to their Google account
   - You'll be redirected to the home page or dashboard

### What Happens During Sign-In

1. **First Sign-In (New User)**:
   - User clicks "Sign in with Google"
   - Google OAuth consent screen appears
   - User authorizes your app
   - NextAuth creates:
     - New `User` record with email, name, and profile picture
     - New `Account` record linking user to Google provider
     - New `Session` record
   - User is redirected to home page

2. **Subsequent Sign-Ins**:
   - User clicks "Sign in with Google"
   - NextAuth finds existing account
   - Updates user profile if needed (name, picture)
   - Creates new session
   - User is redirected

3. **Existing Email User**:
   - If a user signed up with email/password first
   - Then signs in with Google using the same email
   - The Google account will be linked to the existing user
   - User can now sign in with either method

---

## Updated Files

The following files have been updated to support Google OAuth:

### 1. `lib/auth.ts`
- Added `GoogleProvider` configuration
- Added `PrismaAdapter` for database integration
- Updated callbacks to handle Google user data:
  - `signIn` callback: Creates/updates users with Google profile
  - `jwt` callback: Includes user role and image
  - `session` callback: Adds role, ID, and image to session

### 2. `app/auth/signin/page.tsx`
- Added `signIn` from `next-auth/react`
- Added `handleGoogleSignIn` function
- Added Google Sign-In button with official branding
- Added visual divider between credential and OAuth login

### 3. `package.json`
- Added `@next-auth/prisma-adapter` dependency

### 4. `prisma/schema.prisma`
- Already included OAuth models:
  - `Account` model for OAuth providers
  - `Session` model for user sessions
  - `VerificationToken` model
  - Updated `User` model with OAuth support

### 5. Environment Files
- Updated all `.example` files with Google OAuth credentials:
  - `env.example`
  - `env-local.example`
  - `env-vercel.example`
  - `env-contabo.example`

---

## Features

### Dual Authentication Support

Your app now supports both authentication methods:

1. **Traditional Email/Password**
   - Users can sign up with email and password
   - Credentials stored securely with bcrypt hashing
   - Works with existing user base

2. **Google OAuth**
   - One-click sign-in with Google account
   - No password needed
   - Automatic profile picture import
   - Seamless user experience

### Profile Picture Support

- Google profile pictures are automatically imported
- Stored in the `User.image` field
- Accessible in session data
- Can be displayed in user profile, navbar, etc.

### Account Linking

- Users can link multiple authentication methods
- Same email = same user account
- Switch between credential and OAuth signin seamlessly

---

## Troubleshooting

### "Error: Configuration" or "Client ID not set"

**Solution**: Make sure you've added the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your environment file.

```bash
# Check if variables are loaded
echo $GOOGLE_CLIENT_ID
```

If empty, add them to `.env.local` and restart your dev server.

---

### "Redirect URI Mismatch" Error

**Solution**: The redirect URI in your Google Cloud Console must exactly match your callback URL.

For development: `http://localhost:3000/api/auth/callback/google`

For production: `https://www.thewalnutstore.com/api/auth/callback/google`

**Steps to fix:**
1. Go to Google Cloud Console > Credentials
2. Click your OAuth client
3. Add the correct redirect URI
4. Save and try again

---

### Database Connection Error During Migration

**Solution**: Ensure your database server is running and accessible.

```bash
# Test database connection
npx prisma db pull
```

If the server is remote, check:
- Firewall rules
- MySQL server is running
- Correct host, port, username, and password in `MYSQL_URL`

---

### "User Already Exists" When Signing In with Google

**Behavior**: If a user previously signed up with email/password using the same email address, signing in with Google will link the accounts.

This is expected behavior and allows users to:
- Sign in with credentials OR Google
- Maintain a single account across both methods

---

### Session Strategy Conflict

If you encounter issues with the session strategy when using PrismaAdapter:

**Note**: The current configuration uses JWT strategy (`session: { strategy: "jwt" }`). This is compatible with both credential and OAuth providers.

If you want to use database sessions instead:
1. Change `session: { strategy: "database" }`
2. Remove the JWT strategy from auth.ts
3. Adjust callbacks accordingly

---

## Security Best Practices

1. **Never commit secrets**: Always use environment variables for sensitive data
2. **Use different OAuth clients**: Separate clients for development and production
3. **Restrict authorized origins**: Only add your actual domains
4. **Keep secrets secure**: Use Vercel's encrypted environment variables in production
5. **Regular credential rotation**: Update your Google Client Secret periodically
6. **Monitor OAuth consent screen**: Check for suspicious activity in Google Cloud Console

---

## Next Steps

1. ✅ Install required packages
2. ✅ Update database schema
3. ✅ Configure NextAuth with Google provider
4. ✅ Add Google Sign-In button to UI
5. ✅ Update environment variables
6. ⏳ Set up Google Cloud Project (follow this guide)
7. ⏳ Add credentials to environment files
8. ⏳ Run database migration
9. ⏳ Test authentication flow
10. ⏳ Deploy to production

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter Documentation](https://authjs.dev/reference/adapter/prisma)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Support

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review NextAuth.js documentation
3. Check Google Cloud Console for OAuth client configuration
4. Verify environment variables are correctly set
5. Check server logs for detailed error messages

---

*Last Updated: October 2025*

