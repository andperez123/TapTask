# 🔧 Fixed Admin Setup Commands

The issue is that Railway's environment variables need to be accessed differently. Use these corrected commands:

---

## Step 1: Check Available MySQL Variables

First, let's see what MySQL variables Railway provides:

```bash
railway variables
```

Look for variables like:
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- Or `DATABASE_URL`

---

## Step 2: Run Migration - Option 1 (Using DATABASE_URL)

If you have `DATABASE_URL` set:

```bash
# Read the migration file and execute it
railway run sh -c "mysql \$(echo \$DATABASE_URL | sed 's|mysql://||' | sed 's|@| -u |' | sed 's|:| -p|' | sed 's|/| |') < drizzle/migrations/0002_add_password_field.sql"
```

**OR** simpler approach - connect directly:

```bash
# Connect to MySQL and run migration manually
railway run mysql $DATABASE_URL
```

Then paste the SQL manually:
```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;
CREATE INDEX idx_users_email ON users(email);
```

---

## Step 2: Run Migration - Option 2 (Using Individual Variables)

If you have separate MySQL variables, use this:

```bash
railway run sh -c 'mysql -h "$MYSQLHOST" -u "$MYSQLUSER" -p"$MYSQLPASSWORD" "$MYSQLDATABASE" < drizzle/migrations/0002_add_password_field.sql'
```

**Notice the single quotes** - this prevents local shell expansion.

---

## Step 2: Run Migration - Option 3 (Manual SQL Execution)

**EASIEST METHOD** - Connect to MySQL and run SQL manually:

```bash
# Connect to MySQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE
```

If that doesn't work, try:
```bash
railway run mysql $DATABASE_URL
```

Then run these SQL commands:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER email;
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Press `Ctrl+D` or type `exit` to quit MySQL.

---

## Step 3: Verify Migration Worked

```bash
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "DESCRIBE users;"
```

You should see a `password` column in the output.

---

## Step 4: Create Admin User

```bash
railway run sh -c 'cd server && pnpm create-admin'
```

**Or with custom credentials:**

```bash
railway run sh -c 'cd server && ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourSecurePassword123! ADMIN_NAME="Your Name" pnpm create-admin'
```

**Use single quotes around the entire command!**

---

## Alternative: Use Railway's Web Interface

1. Go to Railway dashboard
2. Click on your MySQL service
3. Click "Connect" or "MySQL Console"
4. Run the SQL manually:
   ```sql
   ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;
   ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;
   CREATE INDEX idx_users_email ON users(email);
   ```
5. Click "Execute" or press Enter

---

## Quick Fix Command (Try This First)

```bash
# Check what MySQL variables are available
railway run printenv | grep MYSQL

# Or check all variables
railway variables
```

Then use the correct variable names in the commands above.

