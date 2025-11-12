# 🔐 Admin Authentication Setup Guide

This guide will help you set up proper admin authentication for your TapTask deployment.

## ✅ What's Been Set Up

1. **Password Authentication**: Email/password login system with bcrypt hashing
2. **JWT Tokens**: Secure token-based authentication
3. **Admin Middleware**: Proper role-based access control
4. **Login UI**: Admin dashboard with login form
5. **Database Schema**: Password field added to users table

## 📋 Setup Steps

### Step 1: Run Database Migration

First, you need to add the password field to your database:

```bash
# Option 1: Using MySQL directly
mysql -u root -p taptask < drizzle/migrations/0002_add_password_field.sql

# Option 2: Using Railway CLI (if deployed)
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < drizzle/migrations/0002_add_password_field.sql
```

### Step 2: Create Admin User

Create an admin user with the provided script:

```bash
# From the project root
cd server
pnpm create-admin

# Or with custom credentials
ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=your-secure-password ADMIN_NAME="Your Name" pnpm create-admin
```

**Default credentials** (change these!):
- Email: `admin@taptask.com`
- Password: `admin123`
- Name: `Admin User`

### Step 3: Deploy Changes

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add admin authentication system"
   git push origin main
   ```

2. **Wait for deployment** (Railway/Vercel will auto-deploy)

3. **Run migration on production**:
   ```bash
   # Using Railway CLI
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < drizzle/migrations/0002_add_password_field.sql
   ```

4. **Create admin user on production**:
   ```bash
   railway run pnpm create-admin
   ```

### Step 4: Access Admin Dashboard

1. Navigate to `/admin` on your deployed site
2. Enter your admin email and password
3. You'll be logged in and can manage shortcuts

## 🔒 Security Best Practices

### Change Default Password

After first login, you should:
1. Create a strong password (12+ characters, mixed case, numbers, symbols)
2. Update the admin user password in the database
3. Or create a password change endpoint (future feature)

### Environment Variables

Make sure these are set in production:

```bash
JWT_SECRET=your-very-secure-random-secret-key-here
NODE_ENV=production
```

### Secure Password Requirements

The login endpoint requires:
- Email: Valid email format
- Password: Minimum 6 characters (recommend 12+)

## 🛠️ API Endpoints

### Login
```typescript
POST /trpc/auth.login
{
  email: string;
  password: string;
}

Returns: {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: 'admin';
  }
}
```

### Get Current User
```typescript
GET /trpc/auth.me
Headers: {
  Authorization: "Bearer <token>"
}

Returns: {
  id: number;
  email: string;
  name: string;
  role: 'admin';
  ...
}
```

### Admin Endpoints (Require Admin Role)
- `admin.allShortcuts` - Get all shortcuts
- `admin.getShortcutById` - Get shortcut by ID
- `admin.updateShortcut` - Update shortcut
- `admin.approveShortcut` - Approve shortcut
- `admin.createShortcut` - Create shortcut
- `admin.pendingShortcuts` - Get pending shortcuts

## 🐛 Troubleshooting

### "Admin access required" Error

**Cause**: User is not logged in or doesn't have admin role.

**Solution**:
1. Make sure you're logged in
2. Check that the user has `role: 'admin'` in the database
3. Verify JWT token is being sent in requests

### "Invalid email or password" Error

**Cause**: Wrong credentials or user doesn't exist.

**Solution**:
1. Verify admin user exists in database
2. Check email spelling
3. Reset password by running `create-admin` script again

### Database Migration Errors

**Cause**: Password field might already exist or migration failed.

**Solution**:
1. Check if `password` column exists: `DESCRIBE users;`
2. If it exists, skip migration
3. If migration fails, run it manually in MySQL

### Token Not Persisting

**Cause**: Token not being saved to localStorage.

**Solution**:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check that login response includes token

## 📝 Database Schema Changes

### Users Table

Added fields:
- `password` VARCHAR(255) NULL - Hashed password
- `email` INDEX - For faster email lookups
- `openId` VARCHAR(128) - Increased length for hex strings

### Migration SQL

```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;
CREATE INDEX idx_users_email ON users(email);
```

## 🚀 Production Deployment Checklist

- [ ] Database migration run on production
- [ ] Admin user created on production
- [ ] `JWT_SECRET` set in environment variables
- [ ] Default password changed
- [ ] Admin dashboard accessible at `/admin`
- [ ] Login working correctly
- [ ] Can edit shortcuts after login
- [ ] Logout working correctly

## 🔄 Future Improvements

1. **Password Reset**: Email-based password reset
2. **Password Change**: Allow admins to change their password
3. **Two-Factor Authentication**: Add 2FA for extra security
4. **Session Management**: Track active sessions
5. **Audit Logging**: Log admin actions
6. **Role Management**: Multiple admin roles with different permissions

## 📞 Support

If you encounter issues:
1. Check server logs for errors
2. Verify database connection
3. Check environment variables
4. Review migration status
5. Test login endpoint directly

---

**You're all set!** Your admin authentication is now properly configured for production use. 🎉

