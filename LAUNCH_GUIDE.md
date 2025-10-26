# 🚀 TapTask Launch Guide

## ✅ Current Status
- **Database:** MySQL running on `/tmp/mysql.sock`
- **Total Shortcuts:** 18 (ALL FREE!)
- **Shortcuts Ready:** ✅
- **Purchase Links:** ✅ Added to schema
- **Backend Ready:** ✅
- **Frontend Ready:** ✅

---

## 🎯 Quick Launch (2 Terminals)

### Terminal 1: Backend Server
```bash
# Use Node 20
nvm use 20

# Navigate to server
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server

# Start backend with watch mode
npx tsx watch src/_core/index.ts
```

**Expected output:**
- Server starts on port (check your server config)
- tRPC routes loaded
- Database connected ✅

---

### Terminal 2: Frontend Client
```bash
# Use Node 20
nvm use 20

# Navigate to client
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client

# Start Vite dev server
npx vite
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 📋 Complete Step-by-Step

### Step 1: Verify Prerequisites
```bash
# Check Node version (should be 20+)
node --version

# Check MySQL is running
mysql -u root -e "SELECT 1;"

# Check database exists
mysql -u root -e "SHOW DATABASES LIKE 'taptask';"

# Check shortcuts count
mysql -u root taptask -e "SELECT COUNT(*) FROM shortcuts;"
```

**Expected:** Node v20.x.x, MySQL connected, 18 shortcuts

---

### Step 2: Environment Setup

Check if you have environment variables set. Create `/server/.env` if needed:

```bash
# /Volumes/AHARDRIVE/Apps/Projects/TapTask/server/.env
DATABASE_URL=mysql://root:@localhost:3306/taptask
PORT=3001
NODE_ENV=development

# Stripe keys (optional for free shortcuts)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# App URL
APP_URL=http://localhost:5173
```

---

### Step 3: Install Dependencies (If Needed)

If you haven't installed dependencies:

```bash
# Root level
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
pnpm install

# Or use npm
npm install
```

---

### Step 4: Start Backend

**Terminal 1:**
```bash
# Switch to Node 20
nvm use 20

# Go to server directory
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server

# Start with tsx watch (auto-reload on changes)
npx tsx watch src/_core/index.ts
```

**Wait for:** "Server listening on port XXXX" message

---

### Step 5: Start Frontend

**Terminal 2 (new terminal):**
```bash
# Switch to Node 20
nvm use 20

# Go to client directory
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client

# Start Vite dev server
npx vite
```

**Wait for:** "Local: http://localhost:5173/" message

---

### Step 6: Open Your Browser

Visit: **http://localhost:5173**

You should see:
- 🏠 **Homepage** with shortcut marketplace
- 🔍 **18 FREE shortcuts** available
- 🎯 **Categories:** Productivity, Utilities, Health, Social
- ⚡ **Featured & Trending** shortcuts
- 🆓 **All prices showing $0 (FREE)**

---

## 🎨 What You'll See

### Homepage Features
1. **Hero Section** - Welcome banner
2. **Featured Shortcuts** - Highlighted shortcuts
3. **Categories** - Browse by category
4. **Shortcut Cards** - Each showing:
   - Title & Description
   - FREE badge
   - Download count
   - Creator info
   - Download button

### Available Shortcuts (All FREE!)
1. Battery Health Checker
2. Screenshot Cleaner
3. WiFi Speed Test
4. Daily Affirmations
5. Text to Speech Reader
6. Quick QR Scanner
7. Water Reminder
8. Dark Mode Toggle
9. Emoji Translator
10. Currency Converter
11. Morning Routine Pro
12. Focus Mode Ultimate
13. Smart Expense Tracker
14. Workout Logger Plus
15. Travel Packing Assistant
16. Social Media Scheduler
17. Quick Meeting Notes
18. Meditation Timer Pro

---

## 🛠️ Troubleshooting

### Backend Won't Start

**Problem:** Port already in use
```bash
# Find process using port (e.g., 3001)
lsof -i :3001

# Kill the process
kill -9 <PID>
```

**Problem:** Database connection error
```bash
# Restart MySQL
brew services restart mysql

# Or check if it's running
brew services list | grep mysql
```

**Problem:** Module not found
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server
npm install
# or
pnpm install
```

---

### Frontend Won't Start

**Problem:** Port 5173 in use
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or start on different port
npx vite --port 5174
```

**Problem:** Can't connect to backend
- Make sure backend is running first
- Check backend port matches frontend config

**Problem:** Dependencies missing
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client
npm install
# or
pnpm install
```

---

## 🔥 Hot Reload Features

Both servers support hot reload:

- **Backend:** Changes to `.ts` files auto-restart
- **Frontend:** Changes to `.tsx/.ts/.css` files hot-reload in browser

---

## 🧪 Test Your Setup

### 1. Backend Health Check
Visit: `http://localhost:3001/health` (or your backend port)

Should return: `{"status": "ok"}` or similar

### 2. Test tRPC Connection
Open browser console on `http://localhost:5173`

Should see no connection errors

### 3. Browse Shortcuts
- Click on any shortcut
- Should see detail page
- "Download FREE" button should appear

---

## 📝 Quick Command Reference

### Start Everything (Production-like)
```bash
# Terminal 1 - Backend
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server && npx tsx watch src/_core/index.ts

# Terminal 2 - Frontend  
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client && npx vite
```

### Stop Everything
- Press `Ctrl + C` in both terminals

### Restart Backend Only
- `Ctrl + C` in backend terminal
- Run start command again

### Restart Frontend Only
- `Ctrl + C` in frontend terminal
- Run start command again

---

## 🎯 Next Steps After Launch

1. **Test all shortcuts** - Click through each one
2. **Check categories** - Verify filtering works
3. **Test search** - If implemented
4. **Mobile view** - Check responsive design
5. **Add more shortcuts** - Use the admin API

### Adding More Shortcuts
```typescript
// Use the admin API endpoint
await trpc.admin.createShortcut.mutate({
  title: "New Shortcut",
  slug: "new-shortcut",
  description: "Amazing new shortcut",
  category: "Productivity",
  price: 0, // Keep it FREE!
  iCloudLink: "https://www.icloud.com/shortcuts/abc123",
  creatorId: 1,
  creatorName: "Your Name",
  // ... other fields
});
```

---

## 🚀 You're Ready to Launch!

Just run these two commands in separate terminals:

**Terminal 1:**
```bash
nvm use 20 && cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/server && npx tsx watch src/_core/index.ts
```

**Terminal 2:**
```bash
nvm use 20 && cd /Volumes/AHARDRIVE/Apps/Projects/TapTask/client && npx vite
```

Then visit: **http://localhost:5173** 🎉

---

## 📞 Need Help?

Check these files:
- `README.md` - Project overview
- `SHORTCUTS_GUIDE.md` - Shortcut management
- `DB_SETUP.md` - Database setup
- `STATUS.md` - Project status

All 18 shortcuts are FREE and ready to download! 🆓✨

