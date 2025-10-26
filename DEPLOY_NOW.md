# 🚀 DEPLOY NOW - TapTask Production Checklist

**Goal:** Get TapTask live with your custom domain in 15 minutes!

---

## ✅ Pre-Flight Check

Your app is ready:
- ✅ 18 FREE shortcuts in database
- ✅ Backend configured with health checks
- ✅ Frontend configured with API fallback
- ✅ CORS properly set up
- ✅ Migrations ready
- ✅ All code committed to Git

---

## 🎯 Deploy in 3 Steps

### Step 1: Railway (Backend + Database) - 7 min

**Quick Link:** [railway.app/new](https://railway.app/new)

1. Sign up with GitHub
2. Create new project
3. Add MySQL database
4. Deploy from GitHub repo
5. Set root directory: `server`
6. Add env vars:
   ```
   DATABASE_URL=${{MySQL.DATABASE_URL}}
   NODE_ENV=production
   ```
7. Generate domain → **COPY THIS URL**

---

### Step 2: Vercel (Frontend) - 5 min

**Quick Link:** [vercel.com/new](https://vercel.com/new)

1. Import your GitHub repo
2. Framework: Vite
3. Root directory: `client`
4. Add env var:
   ```
   VITE_API_URL=https://[your-railway-url]
   ```
5. Deploy → **COPY THIS URL**

---

### Step 3: Connect Domain - 2 min

**At Vercel:**
- Settings → Domains → Add your domain

**At Your DNS Provider:**
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

**Update Railway:**
```
APP_URL=https://yourdomain.com
```

---

## 🗄️ Database Setup

After Railway is deployed:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login & link
railway login
railway link

# Run migrations
railway run npx tsx scripts/seed.ts
railway run npx tsx scripts/add-free-shortcuts.ts
```

---

## 🧪 Test Your Deployment

### Backend Health:
```bash
curl https://your-backend.railway.app/health
```
Should return: `{"status":"ok"}`

### Frontend:
Visit: `https://yourdomain.com`
- Should load homepage
- Should show 18 shortcuts
- All should be FREE

---

## 📝 Environment Variables Reference

### Railway (Backend):
```env
DATABASE_URL=${{MySQL.DATABASE_URL}}
NODE_ENV=production
PORT=3000
APP_URL=https://yourdomain.com
```

### Vercel (Frontend):
```env
VITE_API_URL=https://your-backend.railway.app
NODE_ENV=production
```

---

## 🎉 You're Live When...

✅ Backend returns `{"status":"ok"}` at `/health`
✅ Frontend loads at your domain
✅ 18 shortcuts visible on homepage
✅ No CORS errors in browser console
✅ Can click and view shortcut details
✅ Download buttons appear

---

## 🆘 Quick Fixes

**CORS Error:**
```bash
# Update Railway env var:
APP_URL=https://yourdomain.com
# Then restart service
```

**Shortcuts Not Loading:**
```bash
# Check if migrations ran:
railway run npx tsx scripts/seed.ts
```

**Build Failed:**
- Check Vercel logs
- Verify `VITE_API_URL` is set

---

## 📊 What You Get

🌐 **Live Website** with custom domain
🔒 **Free SSL** (automatic HTTPS)
⚡ **Global CDN** (fast worldwide)
🗄️ **Managed Database** (MySQL on Railway)
🚀 **Auto Deploy** (push to GitHub = deploy)
💰 **Free Tier** (Railway $5 credit + Vercel free)

---

## 📈 After Launch

1. Share your link! 🎊
2. Monitor traffic in dashboards
3. Add Google Analytics
4. Set up error tracking (Sentry)
5. Add more shortcuts
6. Enable user authentication
7. Add payment processing

---

## 💡 Pro Tips

- **Auto Deploys**: Push to `main` branch → auto deploys
- **Preview Deploys**: Push to other branches → Vercel creates preview URLs
- **Rollback**: One-click rollback in both platforms
- **Logs**: Check Railway/Vercel dashboards for errors
- **Scale**: Both platforms auto-scale as you grow

---

## 🎯 Success Metrics

After deployment, you'll have:
- ✅ Production app with custom domain
- ✅ 18 FREE shortcuts available
- ✅ Professional HTTPS URLs
- ✅ Auto-deployments set up
- ✅ Database hosted and managed
- ✅ Global CDN distribution

**Time to first user: ~15 minutes!** ⚡

---

## 🔗 Important Links

- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)
- **SSL Test**: [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

## 📞 Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **tRPC Docs**: [trpc.io](https://trpc.io)

---

## 🚀 Ready?

Open these tabs:
1. [railway.app/new](https://railway.app/new) ← Start here
2. [vercel.com/new](https://vercel.com/new) ← Then this
3. Your domain registrar ← Finally DNS

**Let's ship it! 🚢**

---

Your TapTask marketplace will be live in **~15 minutes** with all 18 FREE shortcuts ready for users to download! 🎉

Good luck! 🍀

