import { router, publicProcedure, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import { db } from './db';
import { shortcuts, users, purchases } from '../../drizzle/schema';
import { eq, and, like, or } from 'drizzle-orm';
import * as stripeHelper from './stripe';

export const appRouter = router({
  shortcuts: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        let query = db.select().from(shortcuts);
        
        if (input?.category) {
          query = query.where(eq(shortcuts.category, input.category));
        }
        if (input?.featured) {
          query = query.where(eq(shortcuts.featured, 1));
        }
        if (input?.limit) {
          query = query.limit(input.limit);
        }
        
        return await query;
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

  admin: router({
    pendingShortcuts: adminProcedure
      .query(async () => {
        return await db
          .select()
          .from(shortcuts)
          .where(eq(shortcuts.status, 'pending'));
      }),

    approveShortcut: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db
          .update(shortcuts)
          .set({ status: 'approved' })
          .where(eq(shortcuts.id, input.id));
      }),

    updateShortcut: adminProcedure
      .input(z.object({ 
        id: z.number(),
        purchaseLink: z.string().optional(),
        iCloudLink: z.string().optional(),
        price: z.number().optional(),
        featured: z.number().optional(),
        trending: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await db
          .update(shortcuts)
          .set(updateData)
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
