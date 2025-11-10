import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { shortcuts } from '../server/src/schema';
import { eq, gt } from 'drizzle-orm';

// Load environment variables
config({ path: './server/.env' });

async function makeAllFree() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  console.log('🔄 Making all shortcuts FREE...\n');

  try {
    // Get count of paid shortcuts
    const paidShortcuts = await db.select().from(shortcuts).where(gt(shortcuts.price, 0));
    console.log(`Found ${paidShortcuts.length} paid shortcuts\n`);

    // Update all to free
    await db.update(shortcuts).set({ price: 0 }).where(gt(shortcuts.price, 0));

    // Get updated list
    const allShortcuts = await db.select().from(shortcuts);
    
    console.log('✅ All shortcuts are now FREE!\n');
    console.log('Current shortcuts:');
    console.table(allShortcuts.map(s => ({
      ID: s.id,
      Title: s.title,
      Price: `$${(s.price / 100).toFixed(2)}`,
      Status: s.status,
      Category: s.category,
    })));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

makeAllFree();

