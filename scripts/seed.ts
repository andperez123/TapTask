import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users, shortcuts, creators } from '../drizzle/schema';

// Sample data
const sampleShortcuts = [
  {
    title: "Morning Routine Pro",
    slug: "morning-routine-pro",
    description: "Start your day perfectly. This shortcut automatically opens your calendar, checks weather, plays your favorite playlist, and sends you a motivational quote.",
    category: "Productivity",
    tags: JSON.stringify(["morning", "routine", "automation", "calendar"]),
    price: 299, // $2.99
    iCloudLink: "https://www.icloud.com/shortcuts/sample1",
    purchaseLink: "https://gumroad.com/l/morning-routine-pro", // Example Gumroad link
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
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
    price: 199, // $1.99
    iCloudLink: "https://www.icloud.com/shortcuts/sample2",
    purchaseLink: "https://lemonsqueezy.com/shortcuts/focus-mode", // Example Lemon Squeezy link
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 1,
    trending: 0,
    downloads: 2341,
    purchases: 1523,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Smart Expense Tracker",
    slug: "smart-expense-tracker",
    description: "Track spending effortlessly. Takes a photo of your receipt, extracts the amount using OCR, and logs it to your spreadsheet automatically.",
    category: "Utilities",
    tags: JSON.stringify(["finance", "expenses", "tracking", "ocr"]),
    price: 399, // $3.99
    iCloudLink: "https://www.icloud.com/shortcuts/sample3",
    purchaseLink: "https://gumroad.com/l/expense-tracker-pro",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved",
    featured: 1,
    trending: 1,
    downloads: 892,
    purchases: 567,
    requiredIOSVersion: "16.0",
  },
  {
    title: "Workout Logger Plus",
    slug: "workout-logger-plus",
    description: "Never forget a workout detail. Logs your exercises, reps, and sets to Apple Health and sends a weekly summary every Sunday.",
    category: "Health",
    tags: JSON.stringify(["fitness", "health", "workout", "tracking"]),
    price: 249, // $2.49
    iCloudLink: "https://www.icloud.com/shortcuts/sample4",
    purchaseLink: "https://gumroad.com/l/workout-logger-plus",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved",
    featured: 0,
    trending: 1,
    downloads: 1567,
    purchases: 1234,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Travel Packing Assistant",
    slug: "travel-packing-assistant",
    description: "Pack like a pro. Based on your destination's weather and trip duration, generates a personalized packing checklist.",
    category: "Utilities",
    tags: JSON.stringify(["travel", "packing", "checklist", "weather"]),
    price: 149, // $1.49
    iCloudLink: "https://www.icloud.com/shortcuts/sample5",
    purchaseLink: "https://lemonsqueezy.com/shortcuts/travel-packing",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved",
    featured: 1,
    trending: 0,
    downloads: 743,
    purchases: 521,
    requiredIOSVersion: "16.0",
  },
  {
    title: "Social Media Scheduler",
    slug: "social-media-scheduler",
    description: "Post everywhere at once. Compose once and automatically share to Instagram, Twitter, and Facebook with optimal hashtags.",
    category: "Social",
    tags: JSON.stringify(["social media", "scheduling", "posting", "automation"]),
    price: 499, // $4.99
    iCloudLink: "https://www.icloud.com/shortcuts/sample6",
    purchaseLink: "https://gumroad.com/l/social-scheduler-pro",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved",
    featured: 1,
    trending: 1,
    downloads: 2891,
    purchases: 2156,
    requiredIOSVersion: "16.0",
  },
  {
    title: "Quick Meeting Notes",
    slug: "quick-meeting-notes",
    description: "Capture meetings instantly. Creates a formatted note with attendees from your calendar, timestamps, and action items.",
    category: "Productivity",
    tags: JSON.stringify(["meetings", "notes", "productivity", "work"]),
    price: 99, // $0.99
    iCloudLink: "https://www.icloud.com/shortcuts/sample7",
    purchaseLink: "https://gumroad.com/l/meeting-notes-quick",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 0,
    trending: 0,
    downloads: 456,
    purchases: 234,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Meditation Timer Pro",
    slug: "meditation-timer-pro",
    description: "Find your zen. Customizable meditation timer with ambient sounds, breathing exercises, and progress tracking.",
    category: "Health",
    tags: JSON.stringify(["meditation", "wellness", "mindfulness", "health"]),
    price: 0, // FREE
    iCloudLink: "https://www.icloud.com/shortcuts/sample8",
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved",
    featured: 0,
    trending: 0,
    downloads: 3456,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
];

const sampleUsers = [
  {
    openId: "user_sarah_001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    loginMethod: "apple",
    role: "creator",
    library: JSON.stringify([]),
  },
  {
    openId: "user_mike_002",
    name: "Mike Chen",
    email: "mike@example.com",
    loginMethod: "apple",
    role: "creator",
    library: JSON.stringify([]),
  },
  {
    openId: "user_emma_003",
    name: "Emma Davis",
    email: "emma@example.com",
    loginMethod: "apple",
    role: "creator",
    library: JSON.stringify([]),
  },
  {
    openId: "admin_001",
    name: "Admin User",
    email: "admin@taptask.com",
    loginMethod: "apple",
    role: "admin",
    library: JSON.stringify([]),
  },
];

const sampleCreators = [
  {
    userId: 1,
    stripeAccountStatus: "active",
    totalEarnings: 125673, // $1,256.73
    pendingEarnings: 0,
    shortcutsSubmitted: 8,
    shortcutsApproved: 7,
    shortcutsSold: 2813,
  },
  {
    userId: 2,
    stripeAccountStatus: "active",
    totalEarnings: 89234, // $892.34
    pendingEarnings: 0,
    shortcutsSubmitted: 5,
    shortcutsApproved: 4,
    shortcutsSold: 2324,
  },
  {
    userId: 3,
    stripeAccountStatus: "active",
    totalEarnings: 156789, // $1,567.89
    pendingEarnings: 0,
    shortcutsSubmitted: 6,
    shortcutsApproved: 6,
    shortcutsSold: 2677,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'taptask',
    socketPath: '/tmp/mysql.sock'
  });
  
  const db = drizzle(connection);

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE shortcuts');
    await connection.query('TRUNCATE TABLE creators');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE purchases');
    await connection.query('TRUNCATE TABLE reports');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

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
    console.log(`   Trending: ${sampleShortcuts.filter(s => s.trending).length}`);
    console.log(`   Free: ${sampleShortcuts.filter(s => s.price === 0).length}`);
    console.log('\n✨ Your TapTask marketplace is ready!');
    console.log('🚀 Start your servers and visit http://localhost:5173\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

