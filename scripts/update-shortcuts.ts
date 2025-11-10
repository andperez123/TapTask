import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { shortcuts } from '../server/src/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: './server/.env' });

async function updateShortcuts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  console.log('🔧 Shortcut Update Tool\n');

  try {
    // First, show all shortcuts
    const allShortcuts = await db.select().from(shortcuts);
    
    console.log('📋 Current Shortcuts in Database:\n');
    console.table(allShortcuts.map(s => ({
      ID: s.id,
      Title: s.title,
      iCloudLink: s.iCloudLink?.substring(0, 50) + '...',
      Price: `$${(s.price / 100).toFixed(2)}`,
      Status: s.status,
      Featured: s.featured === 1 ? '⭐' : '',
    })));

    // ============================================
    // EXAMPLE UPDATES - Uncomment and modify as needed
    // ============================================

    // Example 1: Update a specific shortcut's link
    /*
    await db.update(shortcuts).set({
      iCloudLink: 'https://www.icloud.com/shortcuts/NEW_LINK_HERE',
    }).where(eq(shortcuts.id, 1));  // Change ID
    console.log('✅ Updated shortcut ID 1');
    */

    // Example 2: Update title and description
    /*
    await db.update(shortcuts).set({
      title: 'New Title',
      description: 'New description here',
      iCloudLink: 'https://www.icloud.com/shortcuts/...',
    }).where(eq(shortcuts.id, 2));
    console.log('✅ Updated shortcut ID 2');
    */

    // Example 3: Make all shortcuts free
    /*
    await db.update(shortcuts).set({ price: 0 });
    console.log('✅ Made all shortcuts free');
    */

    // Example 4: Approve all pending shortcuts
    /*
    await db.update(shortcuts).set({
      status: 'approved',
    }).where(eq(shortcuts.status, 'pending'));
    console.log('✅ Approved all pending shortcuts');
    */

    // Example 5: Mark specific shortcuts as featured
    /*
    const idsToFeature = [1, 2, 3];
    for (const id of idsToFeature) {
      await db.update(shortcuts).set({ featured: 1 }).where(eq(shortcuts.id, id));
    }
    console.log('✅ Marked shortcuts as featured');
    */

    console.log('\n💡 To make changes, uncomment and modify the examples above!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

updateShortcuts();

