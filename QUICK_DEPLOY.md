# ⚡ Quick Deploy to Production

## 🎯 Fastest Path: Railway + Vercel (15 minutes)

---

## Part 1️⃣: Deploy Backend to Railway (7 minutes)

### Step 1: Go to Railway
👉 Open: [railway.app/new](https://railway.app/new)

### Step 2: Add MySQL
1. Click "New Project"
2. Click "Add MySQL"
3. ✅ Done! MySQL is provisioned

### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select `TapTask` repository
3. Railway auto-detects Node.js

### Step 4: Configure Service
Click on service → **Settings**:
- **Root Directory**: `server`
- **Start Command**: `npx tsx src/_core/index.ts`
- **Build Command**: `npm install`

### Step 5: Add Environment Variables
Click **Variables** tab:
```bash
DATABASE_URL=${{MySQL.DATABASE_URL}}
NODE_ENV=production
PORT=3000
```

### Step 6: Get Backend URL
1. Go to **Settings** → **Networking**
2. Click "Generate Domain"
3. Copy URL (e.g., `taptask-production.up.railway.app`)
4. **📋 SAVE THIS URL!**

### Step 7: Run Database Migrations
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations & seed
railway run mysql -u root -p$MYSQLPASSWORD $MYSQLDATABASE < drizzle/migrations/0001_add_purchase_link.sql
railway run npx tsx scripts/seed.ts
railway run npx tsx scripts/add-free-shortcuts.ts
```

**OR use Railway's web shell:**
1. Click on your service
2. Go to "Settings" → "Deployments"  
3. Click latest deployment → "View Logs"
4. Use the shell to run commands

---

## Part 2️⃣: Deploy Frontend to Vercel (5 minutes)

### Step 1: Go to Vercel
👉 Open: [vercel.com/new](https://vercel.com/new)

### Step 2: Import Repository
1. Click "Import Project"
2. Select your `TapTask` repo
3. Click "Import"

### Step 3: Configure
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Environment Variables
Add this variable:
```bash
VITE_API_URL=https://your-backend.railway.app
```
(Use the URL from Railway Step 6)

### Step 5: Deploy!
Click "Deploy" → Wait 2 minutes ✨

### Step 6: Get Frontend URL
Copy the URL (e.g., `taptask.vercel.app`)

---

## Part 3️⃣: Update Backend CORS (1 minute)

Go back to Railway:
1. Click your service
2. Go to "Variables"
3. Add:
```bash
APP_URL=https://taptask.vercel.app
```
(Use your Vercel URL)

4. Service will auto-redeploy

---

## Part 4️⃣: Add Custom Domain (2 minutes + DNS wait)

### Add to Vercel:
1. Vercel Dashboard → Your project
2. **Settings** → **Domains**
3. Click "Add"
4. Enter: `yourdomain.com`

### Configure DNS:
At your domain registrar (GoDaddy, Namecheap, etc.):

**Add these records:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 300

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

**For API subdomain (optional):**
```
Type: CNAME
Name: api
Value: your-backend.railway.app
TTL: 300
```

### Update Backend CORS Again:
```bash
APP_URL=https://yourdomain.com
```

**Wait 10-60 minutes for DNS propagation** ⏰

---

## ✅ Verification Checklist

### Test Backend:
```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend:
Open `https://yourdomain.com` in browser
- ✅ Homepage loads
- ✅ 18 shortcuts visible
- ✅ All show as FREE
- ✅ No CORS errors in console

---

## 🎉 You're LIVE!

Your app is now running at:
- 🌐 **Frontend**: `https://yourdomain.com`
- 🔌 **Backend**: `https://your-backend.railway.app`
- 🗄️ **Database**: Railway MySQL (managed)

All **18 FREE shortcuts** ready for downloads!

---

## 💡 Pro Tips

### Monitor Your App:
- Railway: Built-in metrics dashboard
- Vercel: Analytics in dashboard

### Update Your App:
Just push to GitHub → Both services auto-deploy! 🚀

### View Logs:
- **Railway**: Dashboard → Service → Deployments → View Logs
- **Vercel**: Dashboard → Project → Deployments → View Function Logs

### Scale Up:
- Railway: Auto-scales, or upgrade plan
- Vercel: Automatic CDN scaling

---

## 🆘 Troubleshooting

### "Site can't be reached"
- Check DNS propagation: [dnschecker.org](https://dnschecker.org)
- Wait up to 1 hour for DNS

### CORS Error:
- Make sure `APP_URL` in Railway matches your domain
- Restart Railway service after changing env vars

### Shortcuts Not Loading:
- Check Railway logs for database errors
- Verify migrations ran successfully
- Test backend: `/health` endpoint

### Build Failed:
- Check Vercel build logs
- Ensure `VITE_API_URL` is set correctly

---

## 📊 Costs

**Current Setup (Free Tier):**
- Railway: $5/month credit (free tier)
- Vercel: Free forever
- Domain: ~$12/year

**Total: $0/month** + domain cost

When you grow:
- Railway: $5-20/month
- Vercel Pro: $20/month (optional)
- **Total: ~$25-40/month**

---

## 🚀 Next Steps

1. ✅ Share your link with users!
2. ✅ Add Google Analytics
3. ✅ Set up monitoring (Sentry)
4. ✅ Add more shortcuts
5. ✅ Implement user auth
6. ✅ Add payment processing (for paid shortcuts)

---

## 📞 Need Help?

**Railway:**
- Docs: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)

**Vercel:**
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

---

## 🎯 Summary

You just deployed a full-stack app with:
- ✅ React + Vite frontend
- ✅ Express + tRPC backend
- ✅ MySQL database
- ✅ 18 FREE shortcuts
- ✅ Custom domain
- ✅ Auto SSL/HTTPS
- ✅ Auto deployments on git push

**Time to production: 15 minutes!** ⚡

Welcome to the live web! 🌐✨

