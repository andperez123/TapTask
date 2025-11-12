# 🔐 Step-by-Step Guide: Creating Admin Account on Production

**Follow these instructions EXACTLY to create your admin account on Railway (production).**

---

## 📋 Prerequisites

Before you start, make sure:
- ✅ Your code is pushed to GitHub (already done!)
- ✅ Railway has auto-deployed your changes
- ✅ You have Railway CLI installed (we'll install it below)
- ✅ You have access to your Railway project

---

## Step 1: Install Railway CLI (2 minutes)

### On macOS/Linux:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```
You should see something like: `railway 3.x.x`

### On Windows:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```

**Expected output**: Version number like `railway 3.x.x`

---

## Step 2: Login to Railway (1 minute)

```bash
# Login to Railway
railway login
```

**What happens:**
1. Terminal will say: "Opening browser..."
2. Your browser will open to Railway login page
3. Click "Authorize" or "Allow" to grant access
4. Terminal will say: "✓ Logged in as [your-email]"

**If it doesn't open browser:**
- Go to: https://railway.app/login
- Log in with GitHub
- Come back to terminal and try again

---

## Step 3: Link to Your Railway Project (2 minutes)

```bash
# Navigate to your project directory
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask

# Link to Railway project
railway link
```

**What happens:**
1. Terminal will show a list of your Railway projects
2. Use arrow keys to select "TapTask" (or your project name)
3. Press Enter
4. Terminal will say: "✓ Linked to project [your-project-name]"

**If you don't see your project:**
- Make sure you're logged into the correct Railway account
- Make sure your project exists on Railway

---

## Step 4: Run Database Migration (3 minutes)

### First, check what environment variables you need:

```bash
# List environment variables (to see database connection info)
railway variables
```

**You should see:**
- `DATABASE_URL` or `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLHOST`

### Option A: If you have DATABASE_URL

```bash
# Run migration using DATABASE_URL
railway run mysql $DATABASE_URL < drizzle/migrations/0002_add_password_field.sql
```

### Option B: If you have separate MySQL variables (more common)

```bash
# Run migration using individual MySQL variables
railway run sh -c "mysql -h \$MYSQLHOST -u \$MYSQLUSER -p\$MYSQLPASSWORD \$MYSQLDATABASE < drizzle/migrations/0002_add_password_field.sql"
```

### Option C: Using Railway's MySQL service directly

```bash
# Connect to MySQL service and run migration
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < drizzle/migrations/0002_add_password_field.sql
```

**What to expect:**
- If successful: No error message, command completes
- If column exists: You'll see an error like "Duplicate column name 'password'" - this is OK, skip to next step
- If connection fails: Check your MySQL variables

**To verify migration worked:**
```bash
# Check if password column exists
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "DESCRIBE users;"
```

**You should see:**
- A row with `password` in the `Field` column
- `Type` should be `varchar(255)`
- `Null` should be `YES`

---

## Step 5: Install Dependencies in Railway (1 minute)

Make sure bcryptjs is installed in your Railway environment:

```bash
# Install dependencies (Railway should do this automatically, but let's verify)
railway run cd server && pnpm install
```

**Expected output:**
- Dependencies will install
- You should see `bcryptjs` in the output

---

## Step 6: Create Admin User (2 minutes)

### Option A: Using Default Credentials

```bash
# Create admin user with default credentials
railway run cd server && pnpm create-admin
```

**Default credentials:**
- Email: `admin@taptask.com`
- Password: `admin123`
- Name: `Admin User`

### Option B: Using Custom Credentials

```bash
# Create admin user with YOUR custom credentials
railway run sh -c "cd server && ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourSecurePassword123! ADMIN_NAME='Your Name' pnpm create-admin"
```

**Replace:**
- `your-email@example.com` with YOUR email
- `YourSecurePassword123!` with YOUR secure password (at least 6 characters)
- `Your Name` with YOUR name

**Example:**
```bash
railway run sh -c "cd server && ADMIN_EMAIL=admin@mydomain.com ADMIN_PASSWORD=MySecurePass123! ADMIN_NAME='John Doe' pnpm create-admin"
```

**What to expect:**

**If admin user doesn't exist:**
```
🔐 Creating admin user...
Email: admin@taptask.com
Password: admin123
✅ Admin user created successfully!
User ID: 1

📝 Login credentials:
Email: admin@taptask.com
Password: admin123

⚠️  Please change the password after first login!

✨ Done!
```

**If admin user already exists:**
```
🔐 Creating admin user...
Email: admin@taptask.com
Password: admin123
⚠️  Admin user already exists. Updating password...
✅ Admin user updated successfully!

✨ Done!
```

**If you get an error:**
- Check that database migration ran successfully
- Check that bcryptjs is installed
- Check that DATABASE_URL is set correctly

---

## Step 7: Verify Admin User Was Created (1 minute)

```bash
# Check if admin user exists in database
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT id, email, name, role FROM users WHERE role='admin';"
```

**You should see:**
```
+----+-------------------+-------------+-------+
| id | email             | name        | role  |
+----+-------------------+-------------+-------+
|  1 | admin@taptask.com| Admin User   | admin |
+----+-------------------+-------------+-------+
```

**If you see this:** ✅ Admin user created successfully!

**If you see nothing:** Admin user wasn't created, go back to Step 6

---

## Step 8: Test Login on Production (2 minutes)

### 1. Go to your live site
- Open: `https://your-frontend-url.vercel.app/admin`
- Or: `https://yourdomain.com/admin`

### 2. You should see a login form

### 3. Enter your credentials:
- **Email**: `admin@taptask.com` (or your custom email)
- **Password**: `admin123` (or your custom password)

### 4. Click "Sign In"

### 5. You should see:
- ✅ Login successful
- ✅ Admin dashboard loads
- ✅ List of shortcuts appears
- ✅ Your name/email in the top right
- ✅ Logout button visible

**If login fails:**
- Check that email and password are correct
- Check browser console for errors (F12)
- Check Railway logs: `railway logs`
- Verify JWT_SECRET is set in Railway environment variables

---

## Step 9: Verify Admin Functions Work (2 minutes)

### Test editing a shortcut:

1. Click "Edit" on any shortcut
2. Edit dialog should open
3. Make a small change (e.g., change title)
4. Click "Save Changes"
5. Change should be saved

**If this works:** ✅ Admin authentication is working correctly!

---

## 🔧 Troubleshooting

### Problem: "Admin access required" error

**Solution:**
1. Check that you're logged in (see your name in top right)
2. Check that user has `role: 'admin'` in database:
   ```bash
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT id, email, role FROM users WHERE email='your-email@example.com';"
   ```
3. If role is not 'admin', update it:
   ```bash
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "UPDATE users SET role='admin' WHERE email='your-email@example.com';"
   ```

### Problem: "Invalid email or password" error

**Solution:**
1. Verify admin user exists:
   ```bash
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT email FROM users WHERE email='your-email@example.com';"
   ```
2. If user doesn't exist, create it again (Step 6)
3. If user exists, reset password:
   ```bash
   railway run cd server && ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=NewPassword123! pnpm create-admin
   ```

### Problem: Migration fails with "Duplicate column"

**Solution:**
- This is OK! It means the password column already exists
- Skip to Step 6 (create admin user)

### Problem: Railway CLI not found

**Solution:**
```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Verify installation
railway --version
```

### Problem: Can't connect to database

**Solution:**
1. Check environment variables:
   ```bash
   railway variables
   ```
2. Verify DATABASE_URL or MySQL variables are set
3. Check Railway dashboard → Your project → MySQL service → Variables

### Problem: bcryptjs not found

**Solution:**
```bash
# Install dependencies
railway run cd server && pnpm install

# Verify bcryptjs is installed
railway run cd server && pnpm list bcryptjs
```

---

## 📝 Quick Reference Commands

### Check Railway connection:
```bash
railway status
```

### View environment variables:
```bash
railway variables
```

### View logs:
```bash
railway logs
```

### Run command in Railway:
```bash
railway run <command>
```

### Connect to MySQL:
```bash
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE
```

### Create admin user:
```bash
railway run cd server && pnpm create-admin
```

### Verify admin user:
```bash
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT id, email, role FROM users WHERE role='admin';"
```

---

## ✅ Success Checklist

After completing all steps, you should have:

- [ ] Railway CLI installed and logged in
- [ ] Project linked to Railway
- [ ] Database migration run successfully
- [ ] Admin user created in database
- [ ] Can login at `/admin` on production
- [ ] Can see shortcuts in admin dashboard
- [ ] Can edit shortcuts
- [ ] Can logout successfully

---

## 🎉 You're Done!

Your admin account is now set up on production. You can:

1. **Login** at `https://your-site.com/admin`
2. **Manage shortcuts** - edit, approve, reject
3. **Create shortcuts** - add new shortcuts
4. **View all shortcuts** - see all shortcuts in the system

**Remember to:**
- ✅ Change the default password after first login
- ✅ Use a strong password (12+ characters)
- ✅ Keep your credentials secure
- ✅ Don't share admin credentials

---

## 🆘 Need Help?

If you get stuck:

1. **Check Railway logs**: `railway logs`
2. **Check browser console** (F12) for errors
3. **Verify environment variables** are set correctly
4. **Test database connection** manually
5. **Check that migration ran** successfully

---

**Good luck! 🚀**

