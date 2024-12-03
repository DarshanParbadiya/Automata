import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { Context } from '@repo/db/context';
export const zapRouter = new Hono<Context>();

zapRouter.get('/', async (c) => {
  return c.json({ message: 'Hello World from zap' });
});
