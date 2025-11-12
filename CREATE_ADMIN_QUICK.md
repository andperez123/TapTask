# ⚡ Quick Admin Account Creation (Copy-Paste Commands)

**Copy and paste these commands in order. Replace placeholders with your values.**

---

## 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

---

## 2. Login to Railway

```bash
railway login
```
*(Follow browser prompts)*

---

## 3. Link to Your Project

```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
railway link
```
*(Select your TapTask project)*

---

## 4. Run Database Migration

```bash
railway run sh -c "mysql -h \$MYSQLHOST -u \$MYSQLUSER -p\$MYSQLPASSWORD \$MYSQLDATABASE < drizzle/migrations/0002_add_password_field.sql"
```

**If you get "Duplicate column" error:** That's OK, skip to next step.

---

## 5. Create Admin User (Default Credentials)

```bash
railway run sh -c "cd server && pnpm create-admin"
```

**Default login:**
- Email: `admin@taptask.com`
- Password: `admin123`

---

## 6. Create Admin User (Custom Credentials)

**Replace the values below with YOUR credentials:**

```bash
railway run sh -c "cd server && ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=YourSecurePassword123! ADMIN_NAME='Your Name' pnpm create-admin"
```

**Example:**
```bash
railway run sh -c "cd server && ADMIN_EMAIL=admin@mydomain.com ADMIN_PASSWORD=MySecurePass123! ADMIN_NAME='John Doe' pnpm create-admin"
```

---

## 7. Verify Admin User

```bash
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SELECT id, email, name, role FROM users WHERE role='admin';"
```

**You should see your admin user listed.**

---

## 8. Test Login

1. Go to: `https://your-site.vercel.app/admin`
2. Enter your email and password
3. Click "Sign In"
4. You should see the admin dashboard!

---

## ✅ Done!

If you see the admin dashboard with shortcuts, you're all set! 🎉

---

## 🐛 Troubleshooting

### Can't connect to database?
```bash
railway variables
```
Check that MySQL variables are set.

### Migration failed?
```bash
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "DESCRIBE users;"
```
Check if `password` column exists.

### Admin user not created?
```bash
railway run cd server && pnpm install
railway run cd server && pnpm create-admin
```

### Can't login?
- Check email/password are correct
- Check browser console (F12) for errors
- Check Railway logs: `railway logs`

---

**That's it! You're ready to manage shortcuts. 🚀**

