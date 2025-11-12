# 📋 Migration SQL - Copy and Paste into Railway MySQL Console

**Copy these SQL commands and run them in Railway's MySQL web console.**

---

## Step 1: Open Railway MySQL Console

1. Go to: https://railway.app/dashboard
2. Click on your **TapTask** project
3. Click on your **MySQL** service
4. Click on **"Query"** or **"MySQL Console"** tab

---

## Step 2: Run Migration SQL

**Copy and paste ALL of this into the query editor:**

```sql
-- Add password column to users table
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;

-- Increase openId field length to support longer hex strings
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;

-- Add index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
```

**Click "Run" or "Execute"**

---

## Step 3: Verify Migration

**Run this to check if migration worked:**

```sql
DESCRIBE users;
```

**You should see:**
- ✅ `password` column exists (type: `varchar(255)`, Null: `YES`)
- ✅ `openId` column has type `varchar(128)`
- ✅ `email` column has an index

---

## Step 4: Create Admin User

**After migration is complete, create admin user using the script:**

```bash
railway run sh -c 'cd server && ADMIN_EMAIL=admin@taptask.com ADMIN_PASSWORD=admin123 ADMIN_NAME="Admin User" pnpm create-admin'
```

**Or use default credentials:**
```bash
railway run sh -c 'cd server && pnpm create-admin'
```

---

## 🐛 If You Get Errors

### "Duplicate column name 'password'"
- ✅ This means the column already exists - migration already ran!
- ✅ Skip to Step 4 (create admin user)

### "Duplicate key name 'idx_users_email'"
- ✅ This means the index already exists - migration already ran!
- ✅ Skip to Step 4 (create admin user)

### "Table 'users' doesn't exist"
- ❌ This means the database isn't set up
- ❌ Run your database setup scripts first

---

## ✅ Done!

Once you see the migration success and admin user created, you're ready to login at `/admin`! 🎉

