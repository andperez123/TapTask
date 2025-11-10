-- Update Shortcut Links in Railway Database
-- Run this in Railway's Query tab

-- ============================================
-- OPTION 1: Update a SINGLE shortcut by ID
-- ============================================
UPDATE shortcuts 
SET 
  iCloudLink = 'https://www.icloud.com/shortcuts/YOUR_NEW_LINK_HERE',
  title = 'Updated Title (optional)',
  description = 'Updated description (optional)',
  category = 'Productivity',  -- Change if needed
  price = 0  -- 0 for free, or amount in CENTS (e.g., 299 = $2.99)
WHERE id = 1;  -- Change to your shortcut ID


-- ============================================
-- OPTION 2: Update by TITLE (if you know the name)
-- ============================================
UPDATE shortcuts 
SET iCloudLink = 'https://www.icloud.com/shortcuts/NEW_LINK'
WHERE title = 'Your Shortcut Name';


-- ============================================
-- OPTION 3: Bulk update multiple shortcuts
-- ============================================

-- Update shortcut ID 1
UPDATE shortcuts 
SET iCloudLink = 'https://www.icloud.com/shortcuts/link1'
WHERE id = 1;

-- Update shortcut ID 2
UPDATE shortcuts 
SET iCloudLink = 'https://www.icloud.com/shortcuts/link2'
WHERE id = 2;

-- Update shortcut ID 3
UPDATE shortcuts 
SET iCloudLink = 'https://www.icloud.com/shortcuts/link3'
WHERE id = 3;


-- ============================================
-- VIEW ALL SHORTCUTS (to see IDs)
-- ============================================
SELECT 
  id,
  title,
  slug,
  iCloudLink,
  price,
  status,
  category,
  featured
FROM shortcuts
ORDER BY id;


-- ============================================
-- APPROVE ALL PENDING SHORTCUTS
-- ============================================
UPDATE shortcuts 
SET status = 'approved' 
WHERE status = 'pending';


-- ============================================
-- MARK SHORTCUTS AS FEATURED
-- ============================================
UPDATE shortcuts 
SET featured = 1 
WHERE id IN (1, 2, 3);  -- Replace with your shortcut IDs


-- ============================================
-- DELETE A SHORTCUT (use carefully!)
-- ============================================
-- DELETE FROM shortcuts WHERE id = 999;  -- Uncomment and change ID to delete

