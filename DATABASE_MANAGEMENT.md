# 🗄️ Database Management Guide

## Quick Reference

### **1. Make All Shortcuts FREE**
```bash
# Option A: Run SQL in Railway Query tab
# Copy from: scripts/make-all-free.sql

# Option B: Run script locally
tsx scripts/make-all-free.ts
```

### **2. Update Shortcut Links**
```bash
# Option A: Run SQL in Railway Query tab  
# Copy from: scripts/update-shortcuts.sql

# Option B: Run script locally
tsx scripts/update-shortcuts.ts
```

---

## 📖 **Detailed Instructions**

### **Method 1: Railway Dashboard (Easiest)**

1. **Go to Railway**: https://railway.app/dashboard
2. Click your **Database service**
3. Click **Query** tab
4. Copy SQL from `scripts/` folder
5. Paste and modify as needed
6. Click **Run Query**

---

### **Method 2: Local Scripts (More Control)**

#### **Setup:**
```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask

# Make sure your server/.env has DATABASE_URL set
# It should point to your Railway database
```

#### **View All Shortcuts:**
```bash
tsx scripts/update-shortcuts.ts
```

#### **Make Everything Free:**
```bash
tsx scripts/make-all-free.ts
```

---

## 🔧 **Common Tasks**

### **View All Shortcuts**
```sql
SELECT id, title, iCloudLink, price, status, featured
FROM shortcuts
ORDER BY id;
```

### **Update a Single Shortcut Link**
```sql
UPDATE shortcuts 
SET iCloudLink = 'https://www.icloud.com/shortcuts/YOUR_LINK'
WHERE id = 1;  -- Change to your shortcut ID
```

### **Update Multiple Fields**
```sql
UPDATE shortcuts 
SET 
  title = 'New Title',
  description = 'New description',
  iCloudLink = 'https://www.icloud.com/shortcuts/...',
  price = 0,  -- FREE
  category = 'Productivity'
WHERE id = 1;
```

### **Make All Shortcuts Free**
```sql
UPDATE shortcuts SET price = 0;
```

### **Approve All Pending Shortcuts**
```sql
UPDATE shortcuts 
SET status = 'approved' 
WHERE status = 'pending';
```

### **Mark Shortcuts as Featured**
```sql
-- Feature specific shortcuts
UPDATE shortcuts 
SET featured = 1 
WHERE id IN (1, 2, 3);

-- Unfeature all
UPDATE shortcuts SET featured = 0;
```

### **Update Prices (in cents!)**
```sql
-- $0 = FREE
UPDATE shortcuts SET price = 0 WHERE id = 1;

-- $0.99
UPDATE shortcuts SET price = 99 WHERE id = 2;

-- $2.99
UPDATE shortcuts SET price = 299 WHERE id = 3;

-- $9.99
UPDATE shortcuts SET price = 999 WHERE id = 4;
```

### **Bulk Update iCloud Links**
```sql
-- Update multiple shortcuts at once
UPDATE shortcuts SET iCloudLink = 'https://www.icloud.com/shortcuts/link1' WHERE id = 1;
UPDATE shortcuts SET iCloudLink = 'https://www.icloud.com/shortcuts/link2' WHERE id = 2;
UPDATE shortcuts SET iCloudLink = 'https://www.icloud.com/shortcuts/link3' WHERE id = 3;
```

---

## 🚨 **Safety Tips**

### **Always Check Before Deleting**
```sql
-- DON'T DO THIS without checking first:
-- DELETE FROM shortcuts WHERE id = 1;

-- INSTEAD, do this first:
SELECT * FROM shortcuts WHERE id = 1;

-- Then if you're sure:
DELETE FROM shortcuts WHERE id = 1;
```

### **Backup First**
```sql
-- Export data before major changes
SELECT * FROM shortcuts;
-- Copy the results somewhere safe
```

---

## 📊 **Useful Queries**

### **Count Shortcuts by Status**
```sql
SELECT status, COUNT(*) as count
FROM shortcuts
GROUP BY status;
```

### **Count Free vs Paid**
```sql
SELECT 
  CASE WHEN price = 0 THEN 'FREE' ELSE 'PAID' END as type,
  COUNT(*) as count
FROM shortcuts
GROUP BY type;
```

### **Find Shortcuts Without Links**
```sql
SELECT id, title, iCloudLink
FROM shortcuts
WHERE iCloudLink IS NULL OR iCloudLink = '';
```

### **Most Popular Shortcuts**
```sql
SELECT id, title, downloads, purchases
FROM shortcuts
ORDER BY downloads DESC
LIMIT 10;
```

### **Featured Shortcuts**
```sql
SELECT id, title, featured, status
FROM shortcuts
WHERE featured = 1 AND status = 'approved';
```

---

## 🔗 **Getting Valid iCloud Links**

### **On iPhone:**
1. Open **Shortcuts** app
2. Find your shortcut
3. Long press → **Details**
4. Turn ON **"Share"** (make it public)
5. Tap **Share** icon (···)
6. Tap **"Copy iCloud Link"**
7. Link format: `https://www.icloud.com/shortcuts/[code]`

### **Testing Links:**
- Open link in Safari on iPhone
- Should prompt to add shortcut
- If error "Not Found" → shortcut is private or deleted

---

## 💳 **Price Reference**

**Prices are stored in CENTS:**

| Display | Database Value |
|---------|---------------|
| FREE    | 0             |
| $0.99   | 99            |
| $1.99   | 199           |
| $2.99   | 299           |
| $4.99   | 499           |
| $9.99   | 999           |
| $19.99  | 1999          |
| $29.99  | 2999          |

---

## 🎯 **Quick Actions**

### **Scenario 1: Just Launched - Make Everything Free**
```bash
tsx scripts/make-all-free.ts
```

### **Scenario 2: Fix Broken Links**
```sql
-- View shortcuts with issues
SELECT id, title, iCloudLink FROM shortcuts WHERE status = 'approved';

-- Update each one
UPDATE shortcuts SET iCloudLink = 'NEW_LINK' WHERE id = X;
```

### **Scenario 3: Promote Best Shortcuts**
```sql
-- Feature your top 5
UPDATE shortcuts SET featured = 1 WHERE id IN (1, 2, 3, 4, 5);

-- Check featured shortcuts
SELECT title, featured FROM shortcuts WHERE featured = 1;
```

---

## 🔍 **Troubleshooting**

### **Changes Not Showing on Site?**
1. Wait 30 seconds (cache)
2. Hard refresh browser: `Cmd + Shift + R`
3. Check Railway deployment status
4. Verify DATABASE_URL is correct

### **Can't Connect to Database?**
1. Check Railway is running
2. Verify `server/.env` has correct DATABASE_URL
3. Try Railway Query tab instead

### **Script Errors?**
```bash
# Make sure you're in project root
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask

# Check .env exists
ls server/.env

# Try running with tsx
pnpm tsx scripts/update-shortcuts.ts
```

---

## 📝 **Best Practices**

1. **Always test on one shortcut first**
2. **Keep iCloud links valid** (don't delete shortcuts from iPhone)
3. **Start with free shortcuts** to build trust
4. **Feature your best shortcuts** (set featured = 1)
5. **Approve shortcuts promptly** via admin dashboard
6. **Monitor analytics** to see what's popular

---

## 🎓 **Example Workflow**

```bash
# 1. View current state
tsx scripts/update-shortcuts.ts

# 2. Make all free for launch
tsx scripts/make-all-free.ts

# 3. Update any broken links via Railway Query tab
# Use SQL from scripts/update-shortcuts.sql

# 4. Approve pending shortcuts
# Go to: https://taptask.cc/admin

# 5. Mark best ones as featured
# Use Railway Query tab or admin dashboard
```

---

**Need help? All scripts are in `/scripts/` folder!** 🚀

