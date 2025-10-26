# TapTask Setup Guide

## Quick Start

Follow these steps to get your TapTask application running:

### 1. Create Environment Files

Create `/Volumes/AHARDRIVE/Apps/Projects/TapTask/server/.env`:
```bash
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:5173
DATABASE_URL=mysql://root:@localhost:3306/taptask
JWT_SECRET=dev_secret_key_change_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

Create `/Volumes/AHARDRIVE/Apps/Projects/TapTask/client/.env`:
```bash
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

### 2. Set Up MySQL Database

```bash
# Start MySQL (if not running)
mysql.server start

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS taptask;"
```

### 3. Run Database Migrations

```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
cd server
npx drizzle-kit push:mysql
```

### 4. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server
pnpm dev
```

**Terminal 2 - Frontend Server:**
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client
pnpm dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Troubleshooting

### If you get "command not found" errors:
Make sure you're using Node.js 20:
```bash
nvm use 20
```

### If database connection fails:
- Check MySQL is running: `mysql.server status`
- Verify DATABASE_URL in server/.env
- Ensure taptask database exists

### If dependencies are missing:
```bash
pnpm install
```

## Next Steps

Once the app is running, you can:
1. Browse shortcuts on the homepage
2. Access admin dashboard at /admin
3. Access creator dashboard at /creator
4. View your library at /library
