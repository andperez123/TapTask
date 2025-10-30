import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../server/src/schema';

const { users, shortcuts, creators } = schema;

// Sample data
const sampleShortcuts = [
  {
    title: "Morning Routine Pro",
    slug: "morning-routine-pro",
    description: "Start your day perfectly. This shortcut automatically opens your calendar, checks weather, plays your favorite playlist, and sends you a motivational quote.",
    category: "Productivity",
    tags: JSON.stringify(["morning", "routine", "automation", "calendar"]),
    price: 299,
    iCloudLink: "https://www.icloud.com/shortcuts/sample1",
    purchaseLink: "https://gumroad.com/l/morning-routine-pro",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved" as const,
    featured: 1,
    trending: 1,
    downloads: 1247,
    purchases: 856,
    requiredIOSVersion: "16.0",
  },
  {
    title: "Focus Mode Ultimate",
    slug: "focus-mode-ultimate",
    description: "Eliminate distractions instantly. Enables Do Not Disturb, closes social apps, opens your task manager, and plays focus music.",
    category: "Productivity",
    tags: JSON.stringify(["focus", "productivity", "work", "concentration"]),
    price: 199,
    iCloudLink: "https://www.icloud.com/shortcuts/sample2",
    purchaseLink: "https://lemonsqueezy.com/shortcuts/focus-mode",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved" as const,
    featured: 1,
    trending: 0,
    downloads: 2341,
    purchases: 1523,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Battery Health Checker",
    slug: "battery-health-checker",
    description: "Check your iPhone's battery health instantly. Shows battery percentage, charging status, and health metrics.",
    category: "Utilities",
    tags: JSON.stringify(["battery", "health", "utilities", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/battery-health",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved" as const,
    featured: 1,
    trending: 0,
    downloads: 5234,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Screenshot Cleaner",
    slug: "screenshot-cleaner",
    description: "Clean up your photo library automatically. Deletes all screenshots older than 7 days with one tap.",
    category: "Utilities",
    tags: JSON.stringify(["photos", "cleanup", "storage", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/screenshot-cleaner",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved" as const,
    featured: 1,
    trending: 0,
    downloads: 8921,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Daily Affirmations",
    slug: "daily-affirmations",
    description: "Start your day with positivity. Displays a random motivational affirmation every morning.",
    category: "Health",
    tags: JSON.stringify(["wellness", "motivation", "mindfulness", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/affirmations",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved" as const,
    featured: 1,
    trending: 1,
    downloads: 6789,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Currency Converter",
    slug: "currency-converter",
    description: "Convert between 150+ currencies with real-time exchange rates. Perfect for travelers.",
    category: "Utilities",
    tags: JSON.stringify(["currency", "travel", "finance", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/currency-converter",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved" as const,
    featured: 1,
    trending: 1,
    downloads: 11234,
    purchases: 0,
    requiredIOSVersion: "16.0",
  },
];

const sampleUsers = [
  {
    openId: "user_sarah_001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    loginMethod: "apple",
    role: "creator" as const,
    library: JSON.stringify([]),
  },
  {
    openId: "user_mike_002",
    name: "Mike Chen",
    email: "mike@example.com",
    loginMethod: "apple",
    role: "creator" as const,
    library: JSON.stringify([]),
  },
  {
    openId: "user_emma_003",
    name: "Emma Davis",
    email: "emma@example.com",
    loginMethod: "apple",
    role: "creator" as const,
    library: JSON.stringify([]),
  },
];

const sampleCreators = [
  {
    userId: 1,
    stripeAccountStatus: "active" as const,
    totalEarnings: 125673,
    pendingEarnings: 0,
    shortcutsSubmitted: 8,
    shortcutsApproved: 7,
    shortcutsSold: 2813,
  },
  {
    userId: 2,
    stripeAccountStatus: "active" as const,
    totalEarnings: 89234,
    pendingEarnings: 0,
    shortcutsSubmitted: 5,
    shortcutsApproved: 4,
    shortcutsSold: 2324,
  },
  {
    userId: 3,
    stripeAccountStatus: "active" as const,
    totalEarnings: 156789,
    pendingEarnings: 0,
    shortcutsSubmitted: 6,
    shortcutsApproved: 6,
    shortcutsSold: 2677,
  },
];

async function seed() {
  console.log('🌱 Starting Railway database seed...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema });

  try {
    // Insert users
    console.log('👥 Creating users...');
    for (const user of sampleUsers) {
      await db.insert(users).values(user);
    }
    console.log(`✅ Created ${sampleUsers.length} users`);

    // Insert creators
    console.log('🎨 Creating creators...');
    for (const creator of sampleCreators) {
      await db.insert(creators).values(creator);
    }
    console.log(`✅ Created ${sampleCreators.length} creators`);

    // Insert shortcuts
    console.log('⚡ Creating shortcuts...');
    for (const shortcut of sampleShortcuts) {
      await db.insert(shortcuts).values(shortcut);
    }
    console.log(`✅ Created ${sampleShortcuts.length} shortcuts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${sampleUsers.length}`);
    console.log(`   Creators: ${sampleCreators.length}`);
    console.log(`   Shortcuts: ${sampleShortcuts.length}`);
    console.log(`   Featured: ${sampleShortcuts.filter(s => s.featured).length}`);
    console.log(`   Free: ${sampleShortcuts.filter(s => s.price === 0).length}`);
    console.log('\n✨ Your TapTask marketplace is ready!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

