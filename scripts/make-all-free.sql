-- Make all shortcuts FREE (price = 0)
-- Run this in Railway's database Query tab

-- Update all shortcuts to FREE
UPDATE shortcuts 
SET price = 0 
WHERE price > 0;

-- Verify the update
SELECT 
  id,
  title,
  price,
  status
FROM shortcuts
ORDER BY id;

-- Count free vs paid
SELECT 
  CASE 
    WHEN price = 0 THEN 'FREE'
    ELSE 'PAID'
  END as pricing_tier,
  COUNT(*) as count
FROM shortcuts
GROUP BY pricing_tier;

