# 🗄️ Database Setup Guide

## Step 1: Install MySQL

### On macOS:
```bash
brew install mysql
brew services start mysql
```

### Or use Docker:
```bash
docker run --name taptask-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=taptask \
  -p 3306:3306 \
  -d mysql:8
```

## Step 2: Create Database

### If using Homebrew MySQL:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS taptask;"
```

### If using Docker:
```bash
docker exec -it taptask-mysql mysql -uroot -ppassword -e "CREATE DATABASE IF NOT EXISTS taptask;"
```

## Step 3: Update Environment Variables

Make sure your `/server/.env` has the correct DATABASE_URL:

### For Homebrew MySQL:
```
DATABASE_URL=mysql://root:@localhost:3306/taptask
```

### For Docker MySQL:
```
DATABASE_URL=mysql://root:password@localhost:3306/taptask
```

## Step 4: Push Database Schema

```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
npx drizzle-kit push --config=drizzle.config.ts
```

This will create all the tables (users, shortcuts, creators, purchases, reports).

## Step 5: Seed Sample Data

```bash
npx tsx scripts/seed.ts
```

This will populate your database with:
- ✅ 4 users (3 creators + 1 admin)
- ✅ 3 creator profiles
- ✅ 8 awesome shortcuts (including featured & trending)
- ✅ Realistic stats (downloads, purchases, earnings)

## Step 6: Verify

```bash
mysql -u root taptask -e "SELECT COUNT(*) as total_shortcuts FROM shortcuts;"
mysql -u root taptask -e "SELECT title, price, category FROM shortcuts LIMIT 5;"
```

## Quick All-In-One Setup

```bash
# Install MySQL (skip if already installed)
brew install mysql
brew services start mysql

# Create database
mysql -u root -e "CREATE DATABASE taptask;"

# Push schema
npx drizzle-kit push --config=drizzle.config.ts

# Seed data
npx tsx scripts/seed.ts

# Done! 🎉
```

## What You'll Get

### 8 Beautiful Sample Shortcuts:
1. **Morning Routine Pro** - $2.99 (Featured, Trending)
2. **Focus Mode Ultimate** - $1.99 (Featured)
3. **Smart Expense Tracker** - $3.99 (Featured, Trending)
4. **Workout Logger Plus** - $2.49 (Trending)
5. **Travel Packing Assistant** - $1.49 (Featured)
6. **Social Media Scheduler** - $4.99 (Featured, Trending)
7. **Quick Meeting Notes** - $0.99
8. **Meditation Timer Pro** - FREE

### 3 Sample Creators:
- **Sarah Johnson** - 7 shortcuts, $1,256.73 earned
- **Mike Chen** - 4 shortcuts, $892.34 earned
- **Emma Davis** - 6 shortcuts, $1,567.89 earned

## Troubleshooting

### "Command not found: mysql"
```bash
# MySQL isn't installed
brew install mysql
```

### "Connection refused"
```bash
# MySQL isn't running
brew services start mysql
```

### "Access denied"
```bash
# Reset MySQL root password
brew services stop mysql
mysqld_safe --skip-grant-tables &
mysql -u root
# Then: ALTER USER 'root'@'localhost' IDENTIFIED BY '';
```

### "Database doesn't exist"
```bash
mysql -u root -e "CREATE DATABASE taptask;"
```

## Next Steps

After setup:
1. Start your servers (see LAUNCH.md)
2. Visit http://localhost:5173
3. See your gorgeous marketplace with real data! 🚀

Your homepage will now show:
- Featured shortcuts carousel
- Real pricing and stats
- Working category filters
- Creator information
- Download/purchase counts


