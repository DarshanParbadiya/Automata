import { PrismaClient } from "@prisma/client/extension";
import { Hono } from "hono";
import { sign } from "hono/jwt";

import { Context } from '@repo/db/context';

export const triggerRouter = new Hono<Context>();

triggerRouter.get('/',async (c)=>{
    return c.json({message: 'Hello World from zap'})
})

triggerRouter.get('/available', async (c) => {
  const prisma = c.get('prisma')
  const availableTriggers = await prisma.availableTrigger.findMany();
  return c.json(availableTriggers);
});