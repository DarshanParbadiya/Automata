import { redisMessageSchema } from '@repo/types/export/worker';
import { Hono } from 'hono';
import { db } from '@repo/db/db';
import { Redis } from '@upstash/redis/cloudflare';
import { RedisContext } from '@repo/db/context';
import { cors } from 'hono/cors';
import { producer, produceSingleMessage } from './lib/producer';
import { performScheduledTask } from './lib/schedultedTask';
import { PrismaClient } from '@prisma/client/edge';
import { mapping } from './constants/helper';

const app = new Hono<RedisContext>();
// app.use(cors());

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
  let prisma: PrismaClient = c.get('prisma');
  const redis = c.get('redis');
  console.log('running single time...');
  // Start the producer in a scheduled manner
  const batchSize = 1; // Define the number of messages to process at once
  const messages = await redis.lrange('PENDING_MESSAGES', 0, batchSize - 1);
  const result = [];
  // console.log(messages)
  for (const message of messages) {
    const parsedValue = JSON.parse(JSON.stringify(message));
    const res = redisMessageSchema.safeParse(parsedValue);
    if (!res.success) {
      console.error('Invalid message:', res.error);
      // SKIP THE MESSAGE OR DELTE IT
      // NOTIFY THE USER ABOUT IT
      continue;
    }

    // console.log()
    const { zapRunId, stage } = parsedValue;
    console.log(zapRunId, stage);

    // const prisma: PrismaClient = c.get('prisma');
    const zapRunDetails = await prisma.zapRun.findFirst({
      where: {
        id: zapRunId,
      },
      include: {
        zap: {
          include: {
            actions: {
              include: {
                type: true,
              },
            },
          },
        },
      },
    });

    const currentAction = zapRunDetails?.zap.actions.find(
      (action) => action.sortingOrder === stage
    );

    if (!currentAction) {
      console.log('No action found for the stage', stage);
      return;
    }

    // findout all available actions
    // const actions = await prisma.availableAction.findMany({});
    // console.log(actions)
    const type = currentAction;
    console.log(type);

    if (currentAction?.type.name == 'email') {
      // send email
      console.log('send email');
    }

    if (currentAction?.type.name == 'github') {
      // do github actions
    }

    // check if it is the last action
    const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
    console.log("lastStage",lastStage)
    if (lastStage == stage){
      // last stage so delete the message after action
    }
    else{
      console.log('adding the message to the redis')
      produceSingleMessage(prisma,redis,{zapRunId,stage:stage+1})
    }

    // const messages = pendingRows.map((r) =>
    //   JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
    // );

    // for (const message of messages) {
    //   await redis.lpush('PENDING_MESSAGES', message);
    // }

    result.push(zapRunDetails);
    // result.push(message);
  }
  // Execute the producer function
  // await producer(prisma, redis);
  // await new Promise((resolve) => setTimeout(resolve,1000))
  return c.json({ message: 'running Single Time', result });
});

app.get('/clear', async (c) => {
  // clears the pending messages
  const redis = c.get('redis');
  await redis.del('PENDING_MESSAGES');
  return c.text('cleared pending messages');
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
