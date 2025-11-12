import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Admin access required. Please log in with an admin account.' 
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);
