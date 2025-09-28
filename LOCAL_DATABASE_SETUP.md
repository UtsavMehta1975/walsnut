# Local Database Setup

## Environment Variables Setup

Create a `.env.local` file in your project root with the following content:

```bash
# Database - Same as production
MYSQL_URL="mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-this-in-production"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Email (Resend or similar)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@chronovault.com"

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Sentry (for error tracking)
SENTRY_DSN="your-sentry-dsn"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Instagram Basic Display API
INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"
INSTAGRAM_ACCESS_TOKEN="your-instagram-access-token"
INSTAGRAM_USER_ID="your-instagram-user-id"
```

## Seed Users

The database has been seeded with 2 test users:

### Admin User
- **Email**: admin@walnut.com
- **Password**: password123
- **Role**: ADMIN
- **Name**: Admin User

### Customer User
- **Email**: user@walnut.com
- **Password**: password123
- **Role**: CUSTOMER
- **Name**: Regular User

## Database Connection Details

- **Host**: 185.196.21.112:3306
- **Database**: walnut_db
- **User**: utsav
- **Connection String**: `mysql://utsav:YourStrongPassword@185.196.21.112:3306/walnut_db`

## Available Tables

1. **users** - User accounts and profiles
2. **categories** - Product categories
3. **products** - Watch products
4. **product_images** - Product images
5. **orders** - Customer orders
6. **order_items** - Individual items in orders
7. **watch_wishlists** - User wishlists
8. **product_categories** - Product-category relationships
9. **reviews** - Product reviews

## How to View Database

### Prisma Studio (Recommended)
```bash
npx prisma studio
```
Opens at http://localhost:5555

### MySQL Command Line
```bash
mysql -h 185.196.21.112 -P 3306 -u utsav -p'YourStrongPassword' walnut_db
```

### View Users
```bash
mysql -h 185.196.21.112 -P 3306 -u utsav -p'YourStrongPassword' walnut_db -e "SELECT * FROM users;"
```

## Running the Project

1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate`
3. Start development server: `npm run dev`
4. Open http://localhost:3000

## Notes

- The same database is used for both local development and production
- All data changes will be reflected in both environments
- Use the seed users for testing authentication
- Remember to change the NEXTAUTH_SECRET in production
