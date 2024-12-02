import { Hono } from 'hono';
import { db } from '@repo/db/db';
import { Redis } from '@upstash/redis/cloudflare';

import { RedisContext } from '@repo/db/context';
import { cors } from 'hono/cors';
import { producer } from './lib/producer';
import { performScheduledTask } from './lib/schedultedTask';

const app = new Hono<RedisContext>();
app.use(cors());

app.use('*', async (c, next) => {
  c.set('prisma', db(c));
  const redis = Redis.fromEnv(c.env);
  c.set('redis', redis);
  await next();
});

app.get('/', async (c) => {
  return c.text('Processor backend!');
});

app.get('/health', async (c) => {
  return c.json({ status: 'ok', service: 'processor' });
});

app.get('/run', async (c) => {
  const prisma = c.get('prisma');
  const redis = c.get('redis');
  console.log('running single time...');
  // Start the producer in a scheduled manner
  // Execute the producer function
  await producer(prisma, redis);
  return c.text('running single time');
});

// export default app;
// Export the Worker
// __scheduled endpoint will be triggered by the cron job
export default {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    return app.fetch(request, env, ctx);
  },

  async scheduled(
    event: ScheduledEvent,
    env: any,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('Cron triggered at:', new Date().toISOString());
    ctx.waitUntil(performScheduledTask(env));
  },
};
