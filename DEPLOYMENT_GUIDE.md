# 🌐 TapTask Production Deployment Guide

Deploy TapTask with your custom domain in minutes!

---

## 🎯 Recommended Stack

**Best Option: Railway (All-in-One)**
- ✅ Backend + Database in one place
- ✅ Easy MySQL hosting
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ One-click deploy
- Frontend: Deploy to Vercel (free)

**Alternative: Render**
- Similar to Railway
- Free tier for web services
- Built-in database support

---

## 🚀 Option 1: Railway + Vercel (RECOMMENDED)

### Part A: Deploy Backend + Database to Railway

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

#### Step 2: Add MySQL Database
1. Click "New" → "Database" → "Add MySQL"
2. Railway will provision a MySQL instance
3. Note down the connection details (automatically available as env vars)

#### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Connect your TapTask repository
3. Select the repository
4. Railway will detect your Node.js app

#### Step 4: Configure Backend Service
1. Click on your service
2. Go to "Settings"
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npx tsx src/_core/index.ts`

#### Step 5: Set Environment Variables
In Railway, go to "Variables" tab and add:

```bash
DATABASE_URL=${{MySQL.DATABASE_URL}}  # Auto-populated by Railway
NODE_ENV=production
PORT=3001

# Your Stripe keys (if using payments)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key

# Frontend URL (add after deploying frontend)
APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

#### Step 6: Get Backend URL
1. Go to "Settings" → "Domains"
2. Click "Generate Domain"
3. Copy the URL (e.g., `your-app.railway.app`)
4. **SAVE THIS** - you'll need it for frontend

#### Step 7: Run Migrations
1. In Railway dashboard, go to your service
2. Click "Deployments" → Select latest deployment
3. Click "View Logs"
4. Or connect via CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx drizzle-kit push

# Or run seed script
railway run npx tsx scripts/seed.ts
railway run npx tsx scripts/add-free-shortcuts.ts
```

---

### Part B: Deploy Frontend to Vercel

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"

#### Step 2: Import Repository
1. Select your TapTask repository
2. Vercel will detect it's a Vite app

#### Step 3: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 4: Set Environment Variables
Add these in Vercel dashboard under "Environment Variables":

```bash
VITE_API_URL=https://your-backend.railway.app
NODE_ENV=production
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. You'll get a URL like `your-app.vercel.app`

#### Step 6: Add Custom Domain
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `taptask.com`)
4. Follow DNS configuration instructions:

**For DNS (at your domain registrar):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (5-60 minutes)
6. Vercel will automatically provision SSL certificate

#### Step 7: Update Backend CORS
Go back to Railway and update environment variables:
```bash
APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

---

## 🚀 Option 2: All-in-One with Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create MySQL Database
1. Click "New +" → "PostgreSQL" (or use external MySQL like PlanetScale)
2. Note: Render doesn't offer MySQL, use PostgreSQL or external MySQL

**For MySQL, use PlanetScale:**
1. Go to [planetscale.com](https://planetscale.com)
2. Create free database
3. Get connection string

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect repository
3. Configure:
   - **Name**: taptask-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npx tsx src/_core/index.ts`

Environment Variables:
```bash
DATABASE_URL=your_planetscale_url
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build && npm run build`
   - **Publish Directory**: `client/dist`

Environment Variables:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Step 5: Custom Domain
1. Go to frontend service → "Settings" → "Custom Domain"
2. Add your domain
3. Configure DNS as instructed

---

## 🚀 Option 3: DigitalOcean App Platform

### Step 1: Create DigitalOcean Account
1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up and add billing info

### Step 2: Create MySQL Database
1. Click "Create" → "Databases" → "MySQL"
2. Choose plan ($15/mo for basic)
3. Wait for provisioning
4. Get connection details

### Step 3: Deploy App
1. Click "Create" → "Apps"
2. Connect GitHub repository
3. DO will detect monorepo structure

Configure Components:
- **Backend**:
  - Source: `server` directory
  - Run Command: `npx tsx src/_core/index.ts`
  - HTTP Port: 8080
  
- **Frontend**:
  - Source: `client` directory  
  - Build Command: `npm run build`
  - Output Directory: `dist`

### Step 4: Set Environment Variables
**Backend:**
```bash
DATABASE_URL=${db.DATABASE_URL}
NODE_ENV=production
```

**Frontend:**
```bash
VITE_API_URL=${backend.PUBLIC_URL}
```

### Step 5: Custom Domain
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as shown

---

## 🔧 Pre-Deployment Checklist

### 1. Update Backend CORS
Edit `server/src/_core/index.ts` (or wherever CORS is configured):

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### 2. Update Frontend API URL
Edit `client/src/lib/trpc.ts`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
    }),
  ],
});
```

### 3. Create Production Build Script
Add to `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && tsc"
  }
}
```

### 4. Environment Variables Summary

**Backend (Railway/Render):**
```env
DATABASE_URL=mysql://user:pass@host:3306/database
NODE_ENV=production
PORT=3001
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://your-backend-url.com
NODE_ENV=production
```

---

## 🌐 DNS Configuration

Once you have your hosting URLs, configure your domain:

### At Your Domain Registrar (e.g., Namecheap, GoDaddy, Cloudflare)

**For Vercel Frontend:**
```
A Record:
Name: @
Value: 76.76.21.21
TTL: 300

CNAME Record:
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

**For Railway Backend (API subdomain):**
```
CNAME Record:
Name: api
Value: your-app.railway.app
TTL: 300
```

Then access:
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`

---

## 🔒 SSL/HTTPS

All recommended platforms provide **automatic SSL certificates**:
- ✅ Vercel: Automatic Let's Encrypt SSL
- ✅ Railway: Automatic SSL
- ✅ Render: Automatic SSL
- ✅ DigitalOcean: Automatic SSL

No configuration needed!

---

## 🚀 Quick Deploy Commands

### Railway Deployment
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd server
railway up

# Run migrations
railway run npx drizzle-kit push
railway run npx tsx scripts/seed.ts
```

### Vercel Deployment
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd client
vercel --prod
```

---

## 📊 Post-Deployment Checklist

After deploying:

1. ✅ **Test Backend API**
   - Visit: `https://api.yourdomain.com/health`
   - Should return success response

2. ✅ **Test Frontend**
   - Visit: `https://yourdomain.com`
   - Should load homepage

3. ✅ **Test Database Connection**
   - Check if shortcuts load
   - Verify all 18 shortcuts appear

4. ✅ **Test CORS**
   - Open browser console
   - Should see no CORS errors

5. ✅ **Test Downloads**
   - Click a shortcut
   - Try downloading

6. ✅ **Mobile Check**
   - Test on mobile device
   - Verify responsive design

---

## 💰 Estimated Costs

### Free Tier Option:
- **Railway**: Free tier ($5/month credit)
- **Vercel**: Free for personal projects
- **Total**: ~$0-5/month

### Production-Ready Option:
- **Railway**: $5-20/month (depending on usage)
- **Vercel Pro**: $20/month (optional, for better features)
- **Custom Domain**: $10-15/year
- **Total**: ~$15-40/month

### Enterprise Option:
- **DigitalOcean**: $30-50/month
- **Managed Database**: $15-25/month
- **CDN**: $5-10/month
- **Total**: ~$50-85/month

---

## 🎯 Recommended Quick Start

**For fastest deployment:**

1. **Deploy Backend to Railway** (5 minutes)
   - MySQL included
   - Auto HTTPS
   - Easy scaling

2. **Deploy Frontend to Vercel** (3 minutes)
   - Auto builds
   - Global CDN
   - Free SSL

3. **Add Custom Domain** (10 minutes + DNS propagation)

**Total time: ~20 minutes + DNS wait (1 hour max)**

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Make sure all dependencies are in package.json
cd server && npm install
cd ../client && npm install

# Test build locally
npm run build
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if database is running
- Ensure migrations are run

### CORS Error
- Update CORS_ORIGIN in backend env vars
- Restart backend service

### 404 on Frontend Routes
- Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🎉 You're Live!

Once deployed, your app will be available at:
- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://api.yourdomain.com`

All 18 FREE shortcuts ready for your users! 🚀

Next steps:
- Add analytics (Google Analytics, Plausible)
- Set up monitoring (Sentry, LogRocket)
- Add email notifications
- Implement user auth

---

Need help? Check platform docs:
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)

