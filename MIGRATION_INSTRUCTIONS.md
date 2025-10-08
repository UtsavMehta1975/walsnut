# Database Migration Instructions

## Overview

The Google OAuth integration requires database schema changes that are already defined in `prisma/schema.prisma`. However, these changes need to be applied to your database.

## When to Run the Migration

Run the migration when:
1. Your database server is accessible and running
2. You have proper database credentials in your environment variables
3. You're ready to enable Google OAuth authentication

## Pre-Migration Checklist

- [ ] Database server is running and accessible
- [ ] Environment variables are set correctly (especially `MYSQL_URL`)
- [ ] You have a database backup (recommended)
- [ ] No active database connections from other processes

## How to Run the Migration

### Option 1: Development Environment

```bash
# Make sure you have the database URL in .env or .env.local
# The migration will create a .env file if needed

# Run the migration
npx prisma migrate dev --name add_google_oauth_support
```

This will:
- Create migration files in `prisma/migrations/`
- Apply the changes to your database
- Regenerate the Prisma Client with updated types

### Option 2: Production Environment

```bash
# For production, use migrate deploy instead
npx prisma migrate deploy
```

## What the Migration Will Do

### New Tables Created

1. **accounts** - Stores OAuth provider information
   - Links users to their Google accounts
   - Stores OAuth tokens and metadata

2. **sessions** - Stores user session data
   - Used by NextAuth for session management
   - Enables better security and tracking

3. **verification_tokens** - Email verification tokens
   - Used for email verification flows
   - Supports password reset functionality

### Existing Table Updated

**users** table will be updated with:
- `image` field (VARCHAR, nullable) - For profile pictures from Google
- `emailVerified` field (DATETIME, nullable) - OAuth verification timestamp
- `hashedPassword` made nullable - OAuth users don't need passwords

**Note**: Existing user data will NOT be affected. All changes are additive or make fields optional.

## After Migration

Once the migration succeeds:

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Restart TypeScript Server** (if you see type errors)
   - In VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
   - Or simply restart your editor

3. **Test the authentication**
   - Visit `/auth/signin`
   - Try the "Sign in with Google" button
   - Check console for any errors

## Troubleshooting

### Error: Can't reach database server

**Solution**: 
- Check if the database server is running
- Verify the `MYSQL_URL` in your environment variables
- Check firewall rules if using a remote database
- Test connection with: `npx prisma db pull`

### Error: P1012 - Environment variable not found

**Solution**: 
- Ensure `MYSQL_URL` is defined in `.env` or `.env.local`
- Prisma CLI looks for `.env` file specifically
- You may need to create `.env` from `.env.local`: `cp .env.local .env`

### TypeScript Errors After Migration

**Solution**: 
1. Regenerate Prisma Client: `npx prisma generate`
2. Restart TypeScript server in your editor
3. Clear and reinstall if needed:
   ```bash
   rm -rf node_modules/.prisma node_modules/@prisma/client
   npx prisma generate
   ```

### Migration Already Exists

If you see "Migration already exists" error:
- Check `prisma/migrations/` folder
- The migration might already be applied
- Run `npx prisma migrate status` to check
- If needed, run `npx prisma migrate resolve --applied <migration-name>`

## Rollback (If Needed)

If something goes wrong and you need to rollback:

1. **Restore from backup** (safest option)
2. **Manual rollback** - Delete the new tables:
   ```sql
   DROP TABLE IF EXISTS accounts;
   DROP TABLE IF EXISTS sessions;
   DROP TABLE IF EXISTS verification_tokens;
   ALTER TABLE users DROP COLUMN image;
   ALTER TABLE users DROP COLUMN emailVerified;
   ```

3. **Undo in Prisma**:
   - Delete the migration folder in `prisma/migrations/`
   - Restore the old schema.prisma
   - Run `npx prisma generate`

## Migration Status

To check if the migration has been applied:

```bash
npx prisma migrate status
```

This will show:
- Applied migrations
- Pending migrations
- Database schema drift

## Next Steps After Successful Migration

1. ✅ Migration applied successfully
2. Set up Google OAuth credentials (see `GOOGLE_OAUTH_SETUP.md`)
3. Add Google credentials to environment variables
4. Test Google Sign-In flow
5. Deploy to production with production OAuth credentials

---

**Note**: The database schema in `prisma/schema.prisma` already includes all necessary models for Google OAuth. This migration just applies those changes to your actual database.

