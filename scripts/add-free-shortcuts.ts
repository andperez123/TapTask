import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { shortcuts } from '../drizzle/schema';

const freeShortcuts = [
  {
    title: "Battery Health Checker",
    slug: "battery-health-checker",
    description: "Check your iPhone's battery health instantly. Shows battery percentage, charging status, and health metrics in a beautiful interface.",
    category: "Utilities",
    tags: JSON.stringify(["battery", "health", "utilities", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/battery-health",
    purchaseLink: null, // Free shortcut - no purchase needed
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 0,
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
    status: "approved",
    featured: 1,
    trending: 0,
    downloads: 8921,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "WiFi Speed Test",
    slug: "wifi-speed-test",
    description: "Test your internet speed instantly. Checks download/upload speeds and displays results with a clean interface.",
    category: "Utilities",
    tags: JSON.stringify(["internet", "speed", "network", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/wifi-speed",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved",
    featured: 0,
    trending: 1,
    downloads: 12456,
    purchases: 0,
    requiredIOSVersion: "16.0",
  },
  {
    title: "Daily Affirmations",
    slug: "daily-affirmations",
    description: "Start your day with positivity. Displays a random motivational affirmation every morning with beautiful visuals.",
    category: "Health",
    tags: JSON.stringify(["wellness", "motivation", "mindfulness", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/affirmations",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 1,
    trending: 1,
    downloads: 6789,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Text to Speech Reader",
    slug: "text-to-speech-reader",
    description: "Listen to any text. Converts selected text, web articles, or clipboard content to natural-sounding speech.",
    category: "Productivity",
    tags: JSON.stringify(["accessibility", "reading", "audio", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/text-speech",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved",
    featured: 0,
    trending: 0,
    downloads: 4321,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Quick QR Scanner",
    slug: "quick-qr-scanner",
    description: "Scan QR codes instantly from your camera or photos. Opens links, adds contacts, and connects to WiFi automatically.",
    category: "Utilities",
    tags: JSON.stringify(["qr", "scanner", "camera", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/qr-scanner",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 0,
    trending: 0,
    downloads: 9876,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Water Reminder",
    slug: "water-reminder",
    description: "Stay hydrated! Set daily water intake goals and get gentle reminders throughout the day to drink water.",
    category: "Health",
    tags: JSON.stringify(["health", "hydration", "wellness", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/water-reminder",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved",
    featured: 1,
    trending: 0,
    downloads: 7654,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Dark Mode Toggle",
    slug: "dark-mode-toggle",
    description: "Switch between light and dark mode instantly. Perfect for reading at night or bright environments.",
    category: "Utilities",
    tags: JSON.stringify(["display", "appearance", "dark mode", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/dark-mode",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 2,
    creatorName: "Mike Chen",
    status: "approved",
    featured: 0,
    trending: 1,
    downloads: 15234,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Emoji Translator",
    slug: "emoji-translator",
    description: "Convert text to emojis and vice versa. Fun way to spice up your messages or decode emoji-heavy texts.",
    category: "Social",
    tags: JSON.stringify(["emoji", "text", "fun", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/emoji-translator",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 1,
    creatorName: "Sarah Johnson",
    status: "approved",
    featured: 0,
    trending: 0,
    downloads: 5432,
    purchases: 0,
    requiredIOSVersion: "15.0",
  },
  {
    title: "Currency Converter",
    slug: "currency-converter",
    description: "Convert between 150+ currencies with real-time exchange rates. Perfect for travelers and international shopping.",
    category: "Utilities",
    tags: JSON.stringify(["currency", "travel", "finance", "free"]),
    price: 0,
    iCloudLink: "https://www.icloud.com/shortcuts/currency-converter",
    purchaseLink: null,
    previewImage: "https://via.placeholder.com/400",
    creatorId: 3,
    creatorName: "Emma Davis",
    status: "approved",
    featured: 1,
    trending: 1,
    downloads: 11234,
    purchases: 0,
    requiredIOSVersion: "16.0",
  },
];

async function addFreeShortcuts() {
  console.log('🆓 Adding free shortcuts...');

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'taptask',
    socketPath: '/tmp/mysql.sock'
  });
  
  const db = drizzle(connection);

  try {
    for (const shortcut of freeShortcuts) {
      await db.insert(shortcuts).values(shortcut);
      console.log(`✅ Added: ${shortcut.title}`);
    }

    console.log('\n🎉 Successfully added all free shortcuts!');
    console.log(`\n📊 Added ${freeShortcuts.length} FREE shortcuts:`);
    freeShortcuts.forEach(s => console.log(`   ✓ ${s.title}`));
    console.log('\n📝 All shortcuts have:');
    console.log('   • Price: $0 (FREE)');
    console.log('   • Status: Approved');
    console.log('   • Ready to download!');
    console.log('\n✨ Visit http://localhost:5173 to see them!\n');

  } catch (error) {
    console.error('❌ Error adding shortcuts:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

addFreeShortcuts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

