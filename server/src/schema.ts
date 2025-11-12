import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
  mysqlEnum,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  openId: varchar('openId', { length: 128 }).notNull().unique(), // Increased for longer hex strings
  name: text('name'),
  email: varchar('email', { length: 320 }),
  password: varchar('password', { length: 255 }), // Hashed password for email/password auth
  loginMethod: varchar('loginMethod', { length: 64 }),
  role: mysqlEnum('role', ['user', 'creator', 'admin']).default('user'),
  stripeCustomerId: varchar('stripeCustomerId', { length: 255 }),
  library: text('library'), // JSON array of shortcut IDs
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  lastSignedIn: timestamp('lastSignedIn').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}));

export const shortcuts = mysqlTable('shortcuts', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags'), // JSON array
  price: int('price').default(0), // In cents
  iCloudLink: text('iCloudLink').notNull(),
  purchaseLink: text('purchaseLink'), // External purchase link (e.g., Gumroad, Lemon Squeezy)
  previewImage: text('previewImage'),
  previewMedia: text('previewMedia'),
  creatorId: int('creatorId').notNull(),
  creatorName: varchar('creatorName', { length: 255 }).notNull(),
  creatorAvatar: text('creatorAvatar'),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
  featured: int('featured').default(0),
  trending: int('trending').default(0),
  downloads: int('downloads').default(0),
  purchases: int('purchases').default(0),
  requiredIOSVersion: varchar('requiredIOSVersion', { length: 50 }),
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
}, (table) => ({
  statusIdx: index('idx_shortcuts_status').on(table.status),
  categoryIdx: index('idx_shortcuts_category').on(table.category),
  creatorIdx: index('idx_shortcuts_creator').on(table.creatorId),
  featuredIdx: index('idx_shortcuts_featured').on(table.featured),
  trendingIdx: index('idx_shortcuts_trending').on(table.trending),
}));

export const creators = mysqlTable('creators', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().unique(),
  stripeAccountId: varchar('stripeAccountId', { length: 255 }),
  stripeAccountStatus: mysqlEnum('stripeAccountStatus', ['pending', 'active', 'restricted']).default('pending'),
  totalEarnings: int('totalEarnings').default(0), // In cents
  pendingEarnings: int('pendingEarnings').default(0),
  shortcutsSubmitted: int('shortcutsSubmitted').default(0),
  shortcutsApproved: int('shortcutsApproved').default(0),
  shortcutsSold: int('shortcutsSold').default(0),
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const purchases = mysqlTable('purchases', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull(),
  shortcutId: int('shortcutId').notNull(),
  price: int('price').notNull(), // In cents
  stripePaymentIntentId: varchar('stripePaymentIntentId', { length: 255 }),
  status: mysqlEnum('status', ['pending', 'completed', 'refunded']).default('pending'),
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdx: index('idx_purchases_user').on(table.userId),
  shortcutIdx: index('idx_purchases_shortcut').on(table.shortcutId),
}));

export const reports = mysqlTable('reports', {
  id: int('id').autoincrement().primaryKey(),
  shortcutId: int('shortcutId').notNull(),
  reportedBy: int('reportedBy').notNull(),
  reason: text('reason').notNull(),
  status: mysqlEnum('status', ['pending', 'resolved', 'dismissed']).default('pending'),
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

