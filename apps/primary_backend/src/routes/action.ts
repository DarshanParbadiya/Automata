import { PrismaClient } from '@prisma/client/edge';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Context } from '@repo/db/context';
import { rateLimiter } from 'hono-rate-limiter';
import { Limiter } from '../lib/rateLimit';
export const actionRouter = new Hono<Context>();

// actionRouter.use(Limiter)

actionRouter.get('/', async (c) => {
  return c.json({ message: 'Hello World from zap' });
});

actionRouter.get('/available', async (c) => {
  const prisma = c.get('prisma');
  const availableActions = await prisma.availableAction.findMany();
  return c.json(availableActions);
});
