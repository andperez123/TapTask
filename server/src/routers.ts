import { router, publicProcedure, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import { db } from './db';
import { shortcuts, users, purchases } from './schema';
import { eq, and, like, or, desc } from 'drizzle-orm';
import * as stripeHelper from './stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const appRouter = router({
  shortcuts: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        try {
          // Build conditions array
          const conditions = [eq(shortcuts.status, 'approved')];
          
          if (input?.category) {
            conditions.push(eq(shortcuts.category, input.category));
          }
          if (input?.featured) {
            conditions.push(eq(shortcuts.featured, 1));
          }
          
          let query = db.select().from(shortcuts).where(and(...conditions));
          
          if (input?.limit) {
            query = query.limit(input.limit);
          }
          
          const results = await query;
          return results;
        } catch (error) {
          console.error('Error fetching shortcuts:', error);
          // Return empty array instead of crashing
          return [];
        }
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const result = await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.slug, input.slug))
          .limit(1);
        return result[0];
      }),
  }),

  auth: router({
    me: protectedProcedure
      .query(async ({ ctx }) => {
        return ctx.user;
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        // Find user by email
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (!user[0] || !user[0].password) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await bcrypt.compare(input.password, user[0].password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Check if user is admin
        if (user[0].role !== 'admin') {
          throw new Error('Access denied. Admin account required.');
        }

        // Update last signed in
        await db
          .update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user[0].id));

        // Generate JWT token
        const token = jwt.sign(
          { userId: user[0].id, openId: user[0].openId },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return {
          token,
          user: {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
          },
        };
      }),

    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        role: z.enum(['user', 'creator', 'admin']).optional().default('user'),
      }))
      .mutation(async ({ input }) => {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser[0]) {
          throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Generate unique openId
        const openId = crypto.randomBytes(32).toString('hex');

        // Create user
        const result = await db.insert(users).values({
          openId,
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
          loginMethod: 'email',
        });

        const userId = result[0].insertId;

        // Generate JWT token
        const token = jwt.sign(
          { userId, openId },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return {
          token,
          user: {
            id: userId,
            email: input.email,
            name: input.name,
            role: input.role,
          },
        };
      }),
  }),

  payment: router({
    createCheckoutSession: publicProcedure
      .input(z.object({ 
        shortcutId: z.number(),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const shortcut = await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.id, input.shortcutId))
          .limit(1);

        if (!shortcut[0]) {
          throw new Error('Shortcut not found');
        }

        const session = await stripeHelper.createCheckoutSession({
          priceAmount: shortcut[0].price,
          currency: 'usd',
          shortcutId: shortcut[0].id,
          shortcutTitle: shortcut[0].title,
          successUrl: input.successUrl || `${process.env.APP_URL}/shortcut/${shortcut[0].slug}?payment=success`,
          cancelUrl: input.cancelUrl || `${process.env.APP_URL}/shortcut/${shortcut[0].slug}`,
        });

        return { 
          sessionId: session.id, 
          url: session.url,
          sessionUrl: session.url 
        };
      }),
  }),

  creator: router({
    // Submit a new shortcut (goes to pending status)
    submitShortcut: publicProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.string().optional(),
        price: z.number().default(0),
        iCloudLink: z.string().url(),
        creatorName: z.string(),
        creatorEmail: z.string().email().optional(),
        previewImage: z.string().optional(),
        requiredIOSVersion: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Generate slug from title
        const slug = input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        const result = await db.insert(shortcuts).values({
          ...input,
          slug,
          creatorId: 0, // Anonymous for now
          status: 'pending',
        });
        return { 
          success: true, 
          id: result[0].insertId,
          message: 'Shortcut submitted for review!' 
        };
      }),
    
    // Get creator's submitted shortcuts
    myShortcuts: publicProcedure
      .input(z.object({ creatorName: z.string() }))
      .query(async ({ input }) => {
        return await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.creatorName, input.creatorName));
      }),
  }),

  admin: router({
    pendingShortcuts: adminProcedure
      .query(async () => {
        return await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.status, 'pending'));
      }),

    allShortcuts: adminProcedure
      .query(async () => {
        try {
          const result = await db
            .select()
            .from(shortcuts)
            .orderBy(desc(shortcuts.createdAt));
          console.log(`[Admin] Fetched ${result.length} shortcuts`);
          return result;
        } catch (error) {
          console.error('[Admin] Error fetching shortcuts:', error);
          throw error;
        }
      }),

    getShortcutById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.id, input.id))
          .limit(1);
        return result[0];
      }),

    approveShortcut: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db
          .update(shortcuts)
          .set({ status: 'approved' })
          .where(eq(shortcuts.id, input.id));
        return { success: true };
      }),

    updateShortcut: adminProcedure
      .input(z.object({ 
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        price: z.number().optional(),
        iCloudLink: z.string().optional(),
        purchaseLink: z.string().optional(),
        previewImage: z.string().optional(),
        previewMedia: z.string().optional(),
        creatorId: z.number().optional(),
        creatorName: z.string().optional(),
        creatorAvatar: z.string().optional(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        featured: z.number().optional(),
        trending: z.number().optional(),
        requiredIOSVersion: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        // Remove undefined values to avoid overwriting with null
        const cleanUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, v]) => v !== undefined)
        );
        await db
          .update(shortcuts)
          .set(cleanUpdateData)
          .where(eq(shortcuts.id, id));
        return { success: true };
      }),

    createShortcut: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.string().optional(),
        price: z.number().default(0),
        iCloudLink: z.string(),
        purchaseLink: z.string().optional(),
        previewImage: z.string().optional(),
        previewMedia: z.string().optional(),
        creatorId: z.number(),
        creatorName: z.string(),
        creatorAvatar: z.string().optional(),
        featured: z.number().default(0),
        trending: z.number().default(0),
        requiredIOSVersion: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.insert(shortcuts).values({
          ...input,
          status: 'approved',
        });
        return { success: true, id: result[0].insertId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
