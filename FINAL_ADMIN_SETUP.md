# ✅ FINAL Admin Setup - Use Railway Web Console

**The `railway run` command has connection issues. Use Railway's web console instead - it's easier and more reliable!**

---

## 🎯 Method 1: Railway Web Console (RECOMMENDED - Easiest)

### Step 1: Open Railway MySQL Console

1. Go to: https://railway.app/dashboard
2. Click on your **TapTask** project
3. Click on your **MySQL** service (not the backend service)
4. Click on the **"Query"** or **"MySQL Console"** tab
5. You should see a SQL query editor

### Step 2: Run Migration SQL

Copy and paste these SQL commands into the query editor:

```sql
-- Add password column
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;

-- Update openId length
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;

-- Create email index
CREATE INDEX idx_users_email ON users(email);
```

**Then click "Run" or "Execute"**

**Expected result:**
- ✅ All three statements execute successfully
- ✅ Or you might see "Duplicate column" errors (that's OK - means it already exists)

### Step 3: Verify Migration

Run this SQL to check:

```sql
DESCRIBE users;
```

**You should see:**
- A `password` column with type `varchar(255)`
- `openId` column with type `varchar(128)`

### Step 4: Create Admin User

Run this SQL (replace with your credentials):

```sql
-- First, check if admin exists
SELECT id, email, role FROM users WHERE email = 'admin@taptask.com';

-- If no results, create admin user
-- You'll need to generate a password hash first, so use the script method below
```

**Actually, it's easier to create the admin user using the script - see Method 2 below!**

---

## 🎯 Method 2: Create Admin User via Script (After Migration)

**After running the migration in Railway's web console, create the admin user:**

### Step 1: Set Environment Variables in Railway

1. Go to Railway dashboard
2. Click on your **backend service** (not MySQL)
3. Click on **"Variables"** tab
4. Add these variables (temporarily):
   - `ADMIN_EMAIL` = `admin@taptask.com` (or your email)
   - `ADMIN_PASSWORD` = `YourSecurePassword123!` (your password)
   - `ADMIN_NAME` = `Admin User` (your name)

### Step 2: Run Create Admin Script

```bash
railway run sh -c 'cd server && pnpm create-admin'
```

**This should work now because:**
- Migration is already done
- Script runs inside Railway's environment
- Has access to DATABASE_URL

**Expected output:**
```
🔐 Creating admin user...
Email: admin@taptask.com
Password: YourSecurePassword123!
✅ Admin user created successfully!
User ID: 1

📝 Login credentials:
Email: admin@taptask.com
Password: YourSecurePassword123!

⚠️  Please change the password after first login!

✨ Done!
```

### Step 3: Remove Temporary Environment Variables

1. Go back to Railway dashboard
2. Click on your backend service
3. Click "Variables" tab
4. Remove the `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` variables
5. (Keep `DATABASE_URL` and other production variables)

---

## 🎯 Method 3: Create Admin User via SQL (Manual)

**If the script doesn't work, create the admin user directly in SQL:**

### Step 1: Generate Password Hash

You need to hash the password first. Use this Node.js command:

```bash
# Run this locally to generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10).then(hash => console.log(hash))"
```

**Copy the hash output** (it will be a long string like `$2a$10$...`)

### Step 2: Create Admin User in Railway MySQL Console

1. Go to Railway dashboard
2. Click on your MySQL service
3. Click "Query" or "MySQL Console"
4. Run this SQL (replace the values):

```sql
-- Generate a random openId (64 characters)
SET @openId = SUBSTRING(MD5(RAND()) FROM 1 FOR 64);

-- Create admin user (replace the password hash with your generated hash)
INSERT INTO users (
  openId,
  email,
  password,
  name,
  role,
  loginMethod
) VALUES (
  @openId,
  'admin@taptask.com',
  '$2a$10$YOUR_PASSWORD_HASH_HERE',  -- Replace with your generated hash
  'Admin User',
  'admin',
  'email'
);
```

**Actually, this is getting complex. Let's use Method 2 (script) instead!**

---

## ✅ Recommended Flow

1. **Run migration in Railway web console** (Method 1, Step 2)
2. **Create admin user via script** (Method 2)
3. **Test login** at `https://your-site.vercel.app/admin`

---

## 🧪 Test Login

1. Go to: `https://your-site.vercel.app/admin`
2. Enter your email and password
3. Click "Sign In"
4. You should see the admin dashboard!

---

## 🐛 Troubleshooting

### Migration fails in web console?
- Check that you're in the MySQL service (not backend service)
- Check that the `users` table exists
- Try running each SQL statement separately

### Admin user script fails?
- Make sure migration ran first
- Check that DATABASE_URL is set in Railway
- Check Railway logs: `railway logs`

### Can't login?
- Verify email/password are correct
- Check browser console (F12) for errors
- Verify JWT_SECRET is set in Railway
- Check that user has `role: 'admin'` in database

---

## 📝 Quick SQL Commands Reference

### Check if password column exists:
```sql
DESCRIBE users;
```

### Check if admin user exists:
```sql
SELECT id, email, name, role FROM users WHERE role = 'admin';
```

### Update existing user to admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Check user's password:
```sql
SELECT id, email, password, role FROM users WHERE email = 'admin@taptask.com';
```
(Password should be a long hashed string)

---

## 🎉 Success!

Once you can login at `/admin` and see shortcuts, you're all set! 🚀

