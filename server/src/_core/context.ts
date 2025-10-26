import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface JWTPayload {
  userId: number;
  openId: string;
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
        return user[0];
      } catch {
        return null;
      }
    }
    return null;
  }

  const user = await getUserFromHeader();

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
