# 🚀 Start TapTask Application

## Prerequisites Checklist

✅ Node.js 20 installed (you have this)
✅ Dependencies installed (you have this - `pnpm install` completed)
⚠️ Need to create environment files
⚠️ Need MySQL database running

## Step 1: Create Environment Files

### Create `server/.env` file:
```bash
cat > server/.env << 'EOF'
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:5173
DATABASE_URL=mysql://root:@localhost:3306/taptask
JWT_SECRET=dev_secret_key_change_in_production
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
EOF
```

### Create `client/.env` file:
```bash
cat > client/.env << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
EOF
```

## Step 2: Start MySQL

If you have MySQL installed:
```bash
# Start MySQL server
mysql.server start

# Create database
mysql -u root -e "CREATE DATABASE taptask;"
```

OR use a Docker container:
```bash
docker run --name taptask-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=taptask -p 3306:3306 -d mysql:8
```

Then update server/.env DATABASE_URL to:
```
DATABASE_URL=mysql://root:password@localhost:3306/taptask
```

## Step 3: Push Database Schema

```bash
cd server
npx drizzle-kit push:mysql
cd ..
```

## Step 4: Start the Application

### Option A: Start both servers together (recommended)
```bash
pnpm dev
```

### Option B: Start servers separately

**Terminal 1 (Backend):**
```bash
cd server
pnpm dev
```

**Terminal 2 (Frontend):**
```bash
cd client
pnpm dev
```

## Step 5: Open Your Browser

Navigate to: **http://localhost:5173**

## Current Status

Your project structure is complete:
- ✅ All dependencies installed
- ✅ Frontend React app configured
- ✅ Backend Express + tRPC server configured
- ✅ Database schema defined
- ✅ All page components created

## What's Missing (you need to do):

1. **Environment files** - Create the .env files above
2. **MySQL database** - Set up and create the taptask database
3. **Start the servers** - Run `pnpm dev`

That's it! Once you complete these 3 steps, your app will be running.





