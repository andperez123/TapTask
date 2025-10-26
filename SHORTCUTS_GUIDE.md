# TapTask Shortcuts Management Guide

## Overview

This guide explains how to manage shortcuts in TapTask, including creating free shortcuts, adding purchase links, and managing shortcut data.

## Database Schema Updates

### New Field: `purchaseLink`

We've added a `purchaseLink` field to the shortcuts table. This field allows you to specify an external purchase link (e.g., Gumroad, Lemon Squeezy, Stripe) where users can buy the shortcut.

**Field Details:**
- **Type:** Text (nullable)
- **Purpose:** Store external purchase URLs
- **Examples:**
  - `https://gumroad.com/l/your-shortcut`
  - `https://lemonsqueezy.com/shortcuts/your-shortcut`
  - `https://buy.stripe.com/your-payment-link`

## Free Shortcuts

### Available Free Shortcuts

We've created **10 free shortcuts** that users can download immediately:

1. **Battery Health Checker** - Check iPhone battery health instantly
2. **Screenshot Cleaner** - Clean up old screenshots automatically
3. **WiFi Speed Test** - Test internet speed with clean interface
4. **Daily Affirmations** - Start your day with positive messages
5. **Text to Speech Reader** - Convert text to natural speech
6. **Quick QR Scanner** - Scan QR codes from camera or photos
7. **Water Reminder** - Stay hydrated with daily reminders
8. **Dark Mode Toggle** - Switch between light/dark mode instantly
9. **Emoji Translator** - Convert text to emojis and back
10. **Currency Converter** - Convert 150+ currencies in real-time

### Adding Free Shortcuts to Database

```bash
# Run from project root
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
npx tsx scripts/add-free-shortcuts.ts
```

This script will:
- Add all 10 free shortcuts to the database
- Set price to $0
- Mark status as "approved"
- Make them immediately available for download

## Backend API for Shortcuts

### Admin Endpoints

#### 1. Create a Shortcut

```typescript
// Endpoint: admin.createShortcut
await trpc.admin.createShortcut.mutate({
  title: "My Awesome Shortcut",
  slug: "my-awesome-shortcut",
  description: "This shortcut does amazing things!",
  category: "Productivity",
  tags: JSON.stringify(["automation", "productivity"]),
  price: 0, // $0 for free, or in cents (e.g., 299 = $2.99)
  iCloudLink: "https://www.icloud.com/shortcuts/your-link",
  purchaseLink: "https://gumroad.com/l/your-shortcut", // Optional
  previewImage: "https://example.com/preview.png",
  creatorId: 1,
  creatorName: "John Doe",
  featured: 0,
  trending: 0,
  requiredIOSVersion: "15.0"
});
```

#### 2. Update a Shortcut

```typescript
// Endpoint: admin.updateShortcut
await trpc.admin.updateShortcut.mutate({
  id: 1,
  purchaseLink: "https://gumroad.com/l/updated-link",
  price: 499, // $4.99
  featured: 1,
  trending: 1
});
```

#### 3. Approve a Shortcut

```typescript
// Endpoint: admin.approveShortcut
await trpc.admin.approveShortcut.mutate({
  id: 1
});
```

## Migration

### Apply Purchase Link Migration

```bash
# The migration file is already created at:
# drizzle/migrations/0001_add_purchase_link.sql

# To apply it, run your migration command:
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
# Add your migration command here based on your setup
```

## Use Cases

### Free Shortcuts
- **Use Case:** Community contributions, starter shortcuts, promotional content
- **Setup:** Set `price: 0` and `purchaseLink: null`
- **Users can:** Download directly from iCloudLink

### Paid Shortcuts (External)
- **Use Case:** Shortcuts sold through Gumroad, Lemon Squeezy, etc.
- **Setup:** Set `price` and provide `purchaseLink`
- **Users:** Click "Buy" → Redirected to `purchaseLink` → After purchase, access `iCloudLink`

### Paid Shortcuts (Internal - Stripe)
- **Use Case:** Shortcuts sold through TapTask's built-in payment system
- **Setup:** Set `price` and leave `purchaseLink` empty/null
- **Users:** Click "Buy" → Stripe checkout → After payment, access `iCloudLink`

## Seed Data

### Run Initial Seed

```bash
cd /Volumes/AHARDRIVE/Apps/Projects/TapTask
npx tsx scripts/seed.ts
```

This creates:
- Sample users (3 creators + 1 admin)
- Sample creators with earnings
- 8 sample shortcuts (7 paid + 1 free)

### Add More Free Shortcuts

```bash
npx tsx scripts/add-free-shortcuts.ts
```

Adds 10 additional free shortcuts without affecting existing data.

## Best Practices

1. **Free Shortcuts**
   - Always set `price: 0`
   - Set `purchaseLink: null`
   - Mark as approved immediately
   - Use for onboarding and community building

2. **Paid Shortcuts**
   - Set realistic prices (in cents)
   - Provide clear descriptions
   - Add preview images/media
   - Test purchase links before publishing

3. **Purchase Links**
   - Use HTTPS URLs
   - Test links before adding to database
   - Consider using URL shorteners for tracking
   - Update links if they change

## Example Workflow

### Creating a Free Shortcut

1. Add the shortcut data to `scripts/add-free-shortcuts.ts`
2. Run: `npx tsx scripts/add-free-shortcuts.ts`
3. Verify in the database
4. Test download on frontend

### Creating a Paid Shortcut with External Link

1. Create product on Gumroad/Lemon Squeezy
2. Get purchase link
3. Use admin API to create shortcut:
   ```typescript
   {
     price: 299, // $2.99
     purchaseLink: "https://gumroad.com/l/my-product",
     iCloudLink: "https://www.icloud.com/shortcuts/abc123"
   }
   ```
4. Test purchase flow

## Support

For issues or questions:
- Check the database schema in `drizzle/schema.ts`
- Review backend routers in `server/src/routers.ts`
- Inspect seed scripts in `scripts/` directory

