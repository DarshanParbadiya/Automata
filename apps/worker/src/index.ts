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
  return c.text('worker backend!');
});

app.get('/health', async (c) => {
  return c.json({ status: 'ok', service: 'worker' });
});

app.get('/run', async (c) => {
  const prisma = c.get('prisma');
  const redis = c.get('redis');
  console.log('running single time...');
  // Start the producer in a scheduled manner
  const batchSize = 1; // Define the number of messages to process at once
  const messages = await redis.lrange('PENDING_MESSAGES', 0, batchSize - 1);
  // console.log(messages)
  for (const message of messages) {
    console.log(message);
    await redis.lrem('PENDING_MESSAGES', 1, message);
    console.log(`Processed and removed message: ${message}`);
  }
  // Execute the producer function
  // await producer(prisma, redis);
  // await new Promise((resolve) => setTimeout(resolve,1000))
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
