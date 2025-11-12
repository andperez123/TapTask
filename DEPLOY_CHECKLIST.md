# 🚀 Deployment Checklist - Push to Production

## ✅ Step 1: Deploy Backend to Railway (7 minutes)

### 1.1 Create Railway Account
👉 Go to: [railway.app/new](https://railway.app/new)
- Sign up with GitHub
- Authorize Railway to access your repositories

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `andperez123/TapTask` repository
4. Click "Deploy Now"

### 1.3 Add MySQL Database
1. In your project, click "New"
2. Select "Database" → "Add MySQL"
3. Wait for MySQL to provision (1-2 minutes)
4. Railway will automatically create a `DATABASE_URL` environment variable

### 1.4 Configure Backend Service
1. Click on your service (the one you just deployed)
2. Go to "Settings" tab
3. Set **Root Directory**: `server`
4. Set **Start Command**: `npx tsx src/_core/index.ts`
5. Set **Build Command**: (leave empty or `cd server && npm install`)

### 1.5 Set Environment Variables
In Railway dashboard → **Variables** tab, add:
```bash
DATABASE_URL=${{MySQL.DATABASE_URL}}
NODE_ENV=production
PORT=3000
```

### 1.6 Generate Domain
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `taptask-production.up.railway.app`)
4. **📋 SAVE THIS URL** - You'll need it for the frontend

### 1.7 Wait for Deployment
- Wait for the build to complete (~2-3 minutes)
- Check the logs to ensure it started successfully
- Visit `https://your-backend.railway.app` - should show your API

---

## ✅ Step 2: Setup Database (5 minutes)

### 2.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2.2 Login to Railway
```bash
railway login
```

### 2.3 Link to Your Project
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
railway link
# Select your project when prompted
```

### 2.4 Run Database Migrations
```bash
# Navigate to server directory
cd server

# Push database schema
railway run npx drizzle-kit push

# Seed initial data (optional - if you have seed scripts)
railway run npx tsx scripts/seed.ts
railway run npx tsx scripts/add-free-shortcuts.ts
```

### 2.5 Verify Database
```bash
# Check if tables were created
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SHOW TABLES;"
```

---

## ✅ Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Create Vercel Account
👉 Go to: [vercel.com/new](https://vercel.com/new)
- Sign up with GitHub
- Authorize Vercel to access your repositories

### 3.2 Import Project
1. Click "Add New Project"
2. Select `andperez123/TapTask` repository
3. Click "Import"

### 3.3 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Set Environment Variables
In Vercel dashboard → **Environment Variables**, add:
```bash
VITE_API_URL=https://your-backend.railway.app
NODE_ENV=production
```
*(Replace `your-backend.railway.app` with your actual Railway URL from Step 1.6)*

### 3.5 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. You'll get a URL like `taptask.vercel.app`
4. **📋 SAVE THIS URL**

---

## ✅ Step 4: Update Backend CORS (2 minutes)

### 4.1 Update Railway Environment Variables
Go back to Railway → **Variables** tab, add:
```bash
APP_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
```
*(Replace with your actual Vercel URL)*

### 4.2 Restart Backend Service
1. Go to Railway dashboard
2. Click on your service
3. Click "Deployments" → "Redeploy"
4. Wait for redeploy to complete

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend
```bash
curl https://your-backend.railway.app/health
```
Should return: `{"status":"ok"}`

### 5.2 Test Frontend
1. Visit: `https://your-frontend.vercel.app`
2. Check browser console for errors
3. Verify shortcuts are loading
4. Test the admin dashboard (if you have admin access)

### 5.3 Test Database Connection
- Visit frontend URL
- Check if shortcuts are displaying
- Verify no CORS errors in console

---

## ✅ Step 6: Add Custom Domain (Optional - 10 minutes)

### 6.1 Add Domain in Vercel
1. Go to Vercel dashboard → Your project → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `taptask.com`)
4. Click "Add"

### 6.2 Configure DNS
At your domain registrar, add these DNS records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.3 Wait for DNS Propagation
- DNS changes can take 5-60 minutes to propagate
- Use [dnschecker.org](https://dnschecker.org) to check propagation

### 6.4 Update Backend CORS Again
Update Railway environment variables:
```bash
APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```
Then redeploy the backend service.

---

## 🎉 You're Live!

Your TapTask marketplace is now live with:
- ✅ Backend API on Railway
- ✅ Frontend on Vercel
- ✅ MySQL database on Railway
- ✅ Admin dashboard for managing shortcuts
- ✅ All shortcuts available for download

---

## 📊 Quick Commands Reference

### Railway CLI
```bash
# Login
railway login

# Link project
railway link

# Run commands
railway run <command>

# View logs
railway logs

# Open shell
railway shell
```

### Vercel CLI
```bash
# Login
vercel login

# Deploy
cd client
vercel --prod

# View deployments
vercel list
```

---

## 🆘 Troubleshooting

### Backend Not Starting
- Check Railway logs
- Verify `DATABASE_URL` is set correctly
- Check if port 3000 is available

### Frontend Build Fails
- Check Vercel build logs
- Verify `VITE_API_URL` is set
- Check if all dependencies are in package.json

### CORS Errors
- Verify `CORS_ORIGIN` is set in Railway
- Make sure it matches your frontend URL exactly
- Restart backend service after updating env vars

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if MySQL service is running in Railway
- Try running migrations again

---

## 🔗 Important Links

- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repository**: [github.com/andperez123/TapTask](https://github.com/andperez123/TapTask)
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)

---

## 💰 Cost Estimate

### Free Tier:
- **Railway**: $5/month credit (usually free for small apps)
- **Vercel**: Free for personal projects
- **Total**: ~$0-5/month

### Production:
- **Railway**: $5-20/month (depending on usage)
- **Vercel Pro**: $20/month (optional)
- **Custom Domain**: $10-15/year
- **Total**: ~$15-40/month

---

## ✅ Post-Deployment Checklist

- [ ] Backend is responding at `/health`
- [ ] Frontend loads without errors
- [ ] Shortcuts are displaying
- [ ] Admin dashboard is accessible
- [ ] No CORS errors in console
- [ ] Database migrations ran successfully
- [ ] Environment variables are set correctly
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificates are active (automatic)
- [ ] Monitoring is set up (optional)

---

**You're ready to deploy! 🚀**

Start with Step 1: [railway.app/new](https://railway.app/new)

