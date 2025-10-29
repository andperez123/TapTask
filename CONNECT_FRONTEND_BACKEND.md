# 🔗 Connect Frontend to Railway Backend

## ✅ What I Just Fixed

### 1. Fixed Import Path Issues
- ✅ Created `/server/src/schema.ts` (copied from `/drizzle/schema.ts`)
- ✅ Updated `server/src/routers.ts` to import from `./schema`
- ✅ Updated `server/src/db.ts` to import from `./schema`  
- ✅ Updated `server/src/_core/context.ts` to import from `../schema`

**Why?** Railway deploys only the `server/` directory, so it couldn't find `../../drizzle/schema`

### 2. Fixed Local Development
- ✅ Changed `pnpm dev` to use `tsx` instead of `tsx watch`
- ✅ This avoids the EPERM permission error on macOS

**Use `dev:watch` if you want hot-reload (but may have permission issues)**

---

## 🚀 Step 1: Redeploy to Railway

Your Railway backend is currently **crashed** because of the import path issue. Now that it's fixed:

### Option A: Auto Deploy (if connected to GitHub)
```bash
# Just commit and push - Railway will auto-deploy
git add .
git commit -m "Fix: Update schema imports for Railway deployment"
git push origin main
```

### Option B: Manual Deploy via Railway CLI
```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Check Deployment Status
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Find your **TapTask** project
3. Wait for deployment to complete (should show **"Deployment successful"**)
4. Click on your service → **Settings** → **Domains** → **Generate Domain**
5. **Copy the generated URL** (e.g., `https://taptask-production.up.railway.app`)

---

## 🌐 Step 2: Connect Frontend to Railway Backend

### Create Client Environment File

```bash
# In /Volumes/AHARDRIVE/Apps/Projects/TapTask/client/
touch .env
```

Add this content (replace with YOUR Railway URL):
```env
VITE_API_URL=https://your-railway-service.up.railway.app
```

**Example:**
```env
VITE_API_URL=https://taptask-production.up.railway.app
```

---

## 🧪 Step 3: Test the Connection

### 1. Start Your Frontend
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
pnpm dev
```

### 2. Check Railway Backend Health
Open in browser or use curl:
```bash
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"2025-10-29T..."}
```

### 3. Open Frontend
Go to: `http://localhost:5173`

**✅ Success Indicators:**
- No `ERR_CONNECTION_REFUSED` errors in console
- Shortcuts load on homepage
- Network tab shows successful requests to your Railway URL

---

## 🛠️ Step 4: Run Database Migrations (If Not Done)

If your Railway database is empty:

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login and link to your project
railway login
railway link

# Run migrations and seed data
railway run -- pnpm -C server exec drizzle-kit push:mysql
railway run -- pnpm exec tsx scripts/seed.ts
railway run -- pnpm exec tsx scripts/add-free-shortcuts.ts
```

---

## 🔧 Local Development Options

### Option 1: Frontend → Railway Backend (Recommended)
```bash
# In client/.env
VITE_API_URL=https://your-railway-url.up.railway.app

# Then run frontend only
cd client && pnpm dev
```

**Pros:** No need to run backend locally, uses production database

### Option 2: Both Local (Full Dev Environment)
```bash
# Terminal 1: Start backend (no watch mode to avoid EPERM error)
cd server && pnpm dev

# Terminal 2: Start frontend  
cd client && pnpm dev

# Configure frontend to use local backend
# In client/.env (or remove .env entirely)
VITE_API_URL=http://localhost:3000
```

**Pros:** Full control, can debug backend
**Cons:** Needs local MySQL database

---

## 📋 Environment Variables Checklist

### Railway (Backend)
```env
DATABASE_URL=${{MySQL.DATABASE_URL}}  # Auto-populated by Railway
NODE_ENV=production
PORT=3000
APP_URL=https://your-frontend-domain.com  # Add when you deploy frontend
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...  # If using Stripe
```

### Client (.env file)
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

---

## 🐛 Troubleshooting

### ERR_CONNECTION_REFUSED
❌ **Problem:** Frontend can't connect to backend
✅ **Solution:**
1. Check Railway deployment is successful (not crashed)
2. Verify `VITE_API_URL` in `client/.env` is correct
3. Restart Vite dev server after changing .env
4. Check CORS settings allow your frontend URL

### Railway Deployment Crashed
❌ **Problem:** "Deployment crashed" in Railway
✅ **Solution:**
1. Check logs in Railway dashboard
2. Verify `DATABASE_URL` is set
3. Make sure all imports use `./schema` not `../../drizzle/schema`
4. Check Node version compatibility

### Local Backend EPERM Error
❌ **Problem:** `tsx watch` permission denied
✅ **Solution:**
```bash
# Use regular tsx (no watch mode)
cd server && pnpm dev

# Or use the watch script (may still have issues)
cd server && pnpm dev:watch
```

### Shortcuts Not Loading
❌ **Problem:** Frontend loads but no shortcuts
✅ **Solution:**
1. Run database migrations (see Step 4 above)
2. Seed data with free shortcuts
3. Check Railway logs for database errors

---

## ✅ Success Checklist

- [ ] Railway backend deployment shows "Deployment successful"
- [ ] Railway health endpoint returns `{"status":"ok"}`
- [ ] `client/.env` has correct `VITE_API_URL`
- [ ] Frontend dev server restarted after .env changes
- [ ] Browser console shows no `ERR_CONNECTION_REFUSED` errors
- [ ] Shortcuts load on homepage
- [ ] Network tab shows requests going to Railway URL

---

## 🎉 You're Done!

Your frontend should now be connected to your Railway backend!

**Next Steps:**
1. Deploy frontend to Vercel (see `DEPLOY_NOW.md`)
2. Add your Vercel URL to Railway `APP_URL` env var
3. Configure custom domain
4. Set up Stripe for payments

---

## 📞 Quick Commands Reference

```bash
# Deploy to Railway (with GitHub)
git push origin main

# Deploy to Railway (manual)
railway up

# Check Railway logs
railway logs

# Run migrations on Railway
railway run -- pnpm exec tsx scripts/seed.ts

# Start local development
pnpm dev

# Start only frontend
cd client && pnpm dev

# Start only backend  
cd server && pnpm dev
```

---

**Current Status:**
- ✅ Import paths fixed for Railway deployment
- ✅ Local dev script fixed (no more EPERM errors)
- ⏳ Waiting for you to redeploy to Railway
- ⏳ Need to create `client/.env` with Railway URL

**Railway Dashboard:** https://railway.app/dashboard
**Your Project:** nurturing-endurance

