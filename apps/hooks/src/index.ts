import { Hono } from 'hono';
import { db } from '@repo/db/db';

import { Context } from '@repo/db/context';
import { cors } from 'hono/cors';

const app = new Hono<Context>();
app.use(cors());

app.use('*', async (c, next) => {
  c.set('prisma', db(c));
  await next();
});

app.get('/', async (c) => {
  return c.text('Hooks backend!');
});

app.get('/health', async (c) => {
  return c.json({ status: 'ok', service: 'Hooks' });
});

app.post('/hooks/catch/:userId/:zapId', async (c) => {
  const userId = c.req.param('userId');
  const zapId = c.req.param('zapId');
  const db = c.get('prisma');
  const body = await c.req.json();
  console.log(body);
  console.log(userId, zapId);

  // store in db a new trigger
  await db.$transaction(async (tx: any) => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });

    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });
  return c.json(
    {
      message: 'Webhook received',
    },
    201
  );
});

export default app;
