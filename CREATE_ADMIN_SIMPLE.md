# ⚡ Simple Admin Setup (Railway DATABASE_URL)

**Your Railway uses `DATABASE_URL`. Use these SIMPLE commands:**

---

## Step 1: Run Migration (Easy Method)

Since Railway uses `DATABASE_URL`, use our migration script:

```bash
railway run sh -c 'cd server && pnpm run-migration'
```

**What this does:**
- ✅ Connects to database using DATABASE_URL
- ✅ Adds password column to users table
- ✅ Updates openId column length to 128
- ✅ Creates email index
- ✅ Handles errors gracefully (won't fail if columns already exist)

**Expected output:**
```
🔄 Running database migration...
Connecting to database...
✅ Connected to database
Found 3 SQL statements
✅ Executed: ALTER TABLE users ADD COLUMN password VARCHAR(255)...
✅ Executed: ALTER TABLE users MODIFY COLUMN openId VARCHAR(128)...
✅ Created email index
✅ Migration completed successfully!

✨ Done!
```

---

## Step 2: Create Admin User

```bash
railway run sh -c 'cd server && pnpm create-admin'
```

**Default credentials:**
- Email: `admin@taptask.com`
- Password: `admin123`

**Or with custom credentials:**
```bash
railway run sh -c 'cd server && ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourSecurePassword123! ADMIN_NAME="Your Name" pnpm create-admin'
```

**Use single quotes** around the entire command!

---

## Step 3: Verify Admin User

```bash
railway run sh -c 'cd server && node -e "import(\"../server/src/db.js\").then(({db}) => import(\"../server/src/schema.js\").then(({users}) => import(\"drizzle-orm\").then(({eq}) => db.select().from(users).where(eq(users.role, \"admin\")).then(r => console.log(r)))))"'
```

**OR** simpler - just test login at:
`https://your-site.vercel.app/admin`

---

## Alternative: Manual MySQL Connection

If the script doesn't work, connect to MySQL directly:

### Option A: Using Railway's MySQL Service

1. Go to Railway dashboard
2. Click on your MySQL service
3. Click "Connect" or "MySQL Console"  
4. Run these SQL commands:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER email;
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

**Note:** MySQL might not support `IF NOT EXISTS` for ALTER TABLE, so if you get an error, try:

```sql
-- Check if password column exists first
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password';

-- If it doesn't exist, run:
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;

-- Update openId length
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;

-- Create index (will fail if exists, that's OK)
CREATE INDEX idx_users_email ON users(email);
```

---

## Quick Test Commands

### Check if migration worked:
```bash
railway run sh -c 'cd server && node -e "import(\"../server/src/db.js\").then(({db}) => db.execute(\"DESCRIBE users\").then(([rows]) => console.log(rows)))"'
```

You should see `password` in the column list.

### Check if admin user exists:
```bash
railway run sh -c 'cd server && pnpm create-admin'
```

If admin exists, it will update the password. If not, it will create one.

---

## ✅ Success Checklist

- [ ] Migration script ran successfully
- [ ] Admin user created
- [ ] Can login at `/admin` on production
- [ ] Can see shortcuts in admin dashboard

---

## 🐛 Troubleshooting

### Migration script fails?
- Check that `DATABASE_URL` is set: `railway variables`
- Check server logs: `railway logs`
- Try manual SQL (Option A above)

### Admin user not created?
- Check that migration ran first
- Verify DATABASE_URL is correct
- Check Railway logs for errors

### Can't login?
- Verify email/password are correct
- Check browser console (F12) for errors
- Check Railway logs: `railway logs`
- Verify JWT_SECRET is set in Railway

---

## 🚀 You're Ready!

Once you can login at `/admin`, you're all set! 🎉

