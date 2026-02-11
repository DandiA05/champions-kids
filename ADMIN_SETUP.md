# Admin Panel Setup Guide

## Overview
This admin panel provides JWT-based authentication and user management for your Next.js application.

## Initial Setup

### 1. Database Setup

Run the migration script in your Neon PostgreSQL console:

```sql
-- Copy and paste the contents of database/migration.sql
```

### 2. Create First Admin User

**Option A: Generate bcrypt hash**
```bash
node scripts/create-admin.js
```
This will output a bcrypt hash. Copy the SQL statement and run it in your Neon console.

**Option B: Use the API (temporary)**
Temporarily comment out the admin check in `/app/api/admin/users/route.ts` to create the first admin user via the API.

### 3. Environment Variables

Ensure your `.env` file has:
```
DATABASE_URL='your-neon-database-url'
JWT_SECRET='your-super-secret-jwt-key-change-this-in-production-min-32-chars'
```

**Important:** Change the JWT_SECRET to a strong, random string in production!

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin`
2. You'll be redirected to `/admin/login`
3. Login with your admin credentials
4. After successful login, you'll be redirected to the dashboard

### Default Test Credentials
- Email: `admin@test.com`
- Password: `admin123`

**Change these immediately in production!**

### Features

#### Dashboard (`/admin`)
- View total users count
- View admin users count
- Quick statistics overview

#### User Management (`/admin/users`)
- View all users in a table
- Create new users (admin or non-admin)
- See user roles and creation dates

## Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **HttpOnly Cookies** - Tokens stored securely
✅ **Password Hashing** - bcrypt with salt
✅ **Role-Based Access** - Admin-only routes
✅ **Middleware Protection** - Route-level security
✅ **Token Expiration** - 7-day expiry

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get current user info

### User Management (Admin Only)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user

## Troubleshooting

### Can't login
- Check database connection
- Verify user exists in database
- Ensure password hash is correct
- Check JWT_SECRET is set

### Redirected to login after successful auth
- Check JWT_SECRET matches
- Verify cookie is being set
- Check middleware configuration

### Can't create users
- Ensure you're logged in as admin
- Check database connection
- Verify email doesn't already exist

## Next Steps

1. ✅ Run database migration
2. ✅ Create first admin user
3. ✅ Login to admin panel
4. ✅ Create additional users
5. 🔒 Change default passwords
6. 🔒 Update JWT_SECRET for production
7. 🔒 Add HTTPS in production
