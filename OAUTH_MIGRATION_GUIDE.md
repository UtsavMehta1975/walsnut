# OAuth Database Migration Guide

## Overview
This guide explains how to set up the database tables required for Google OAuth authentication.

## Required Tables

The following tables are required for OAuth to work properly:

1. **accounts** - Stores OAuth provider account information
2. **sessions** - Stores user session data
3. **verification_tokens** - For email verification flows
4. **users** - Updated to support OAuth (image, emailVerified fields)

## Migration Options

### Option 1: Using Prisma Migrate (Recommended)

This is the cleanest approach and will keep your schema in sync:

```bash
# Generate a new migration
npx prisma migrate dev --name add_oauth_support

# Or if on production
npx prisma migrate deploy
```

### Option 2: Using the SQL Migration Script

If you prefer to run the SQL directly:

```bash
# Connect to your MySQL database and run:
mysql -u your_username -p -h your_host your_database < prisma/migrations/add_oauth_support.sql
```

### Option 3: Using Prisma DB Push (Quick Development)

For quick development/testing:

```bash
npx prisma db push
```

This will sync your database with the schema without creating migration files.

## Verify Migration

After running the migration, verify the tables exist:

```sql
-- Check if tables exist
SHOW TABLES LIKE 'accounts';
SHOW TABLES LIKE 'sessions';
SHOW TABLES LIKE 'verification_tokens';

-- Check users table structure
DESCRIBE users;

-- Verify foreign keys
SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_NAME IN ('accounts', 'sessions') 
AND REFERENCED_TABLE_NAME = 'users';
```

## Environment Variables Required

Make sure you have these environment variables set:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # or your production URL
NEXTAUTH_SECRET=your-secret-key-here

# Database
MYSQL_URL=mysql://user:password@host:port/database
```

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## Testing OAuth Flow

After migration, test the OAuth flow:

1. Start your dev server: `npm run dev`
2. Go to `/auth/signin`
3. Click "Sign in with Google"
4. Authorize with Google
5. Should redirect back and create account

Check the database:

```sql
-- Check if user was created
SELECT * FROM users ORDER BY createdAt DESC LIMIT 1;

-- Check if account link was created
SELECT * FROM accounts ORDER BY id DESC LIMIT 1;

-- Check if session was created
SELECT * FROM sessions ORDER BY expires DESC LIMIT 1;
```

## Troubleshooting

### Issue: Tables already exist error

If tables already exist but have different structure:

```sql
-- Backup your data first!
-- Then drop and recreate
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS verification_tokens;

-- Then run migration again
```

### Issue: Foreign key constraint fails

Make sure the users table exists first:

```sql
-- Check if users table exists
SHOW TABLES LIKE 'users';

-- If not, run Prisma migrate for the entire schema
npx prisma migrate deploy
```

### Issue: Google OAuth fails with redirect_uri_mismatch

- Check that redirect URI in Google Console matches exactly
- Check NEXTAUTH_URL environment variable
- Format: `{NEXTAUTH_URL}/api/auth/callback/google`

### Issue: User created but role is null

The signIn event in lib/auth.ts sets the default role. Check:

1. Event handler is being called (check logs)
2. Database allows NULL for role (it shouldn't)
3. Default value in schema is set: `role UserRole @default(CUSTOMER)`

## Production Deployment

When deploying to production:

1. **Set production environment variables** in your hosting platform
2. **Run migration**: `npx prisma migrate deploy`
3. **Generate Prisma client**: `npx prisma generate`
4. **Update Google OAuth redirect URIs** to production domain
5. **Test OAuth flow** on production

## Security Checklist

- [ ] NEXTAUTH_SECRET is a strong random string
- [ ] Google OAuth credentials are in environment variables, not code
- [ ] Database user has appropriate permissions
- [ ] HTTPS is enabled in production
- [ ] OAuth redirect URIs are exact matches
- [ ] Rate limiting is enabled on auth endpoints

## Success Criteria

Your OAuth integration is working when:

- [x] User can click "Sign in with Google"
- [x] Google authorization flow completes
- [x] User record is created in users table
- [x] Account record is created in accounts table
- [x] Session is created and user is logged in
- [x] Profile picture from Google is displayed
- [x] User can log out and log back in
- [x] Existing email users can link Google account

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter Documentation](https://next-auth.js.org/adapters/prisma)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

