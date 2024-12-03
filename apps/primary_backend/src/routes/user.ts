import { PrismaClient } from '@prisma/client/edge';
import { Context } from '@repo/db/context';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';

export const userRouter = new Hono<Context>();

userRouter.get('/available', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  });
  const availableTriggers = c.get('prisma').availableTrigger.findMany();

  return c.json(availableTriggers);
});
