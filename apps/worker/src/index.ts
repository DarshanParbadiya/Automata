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
import { JsonObject } from '@prisma/client/runtime/library';
import { parser } from './lib/parser';
import { sendEmail } from './lib/email';
import { decode, sign, verify } from 'hono/jwt';

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

app.get('/send', async (c) => {
  const authToken = await sign(
    { message: 'Email sending Services for Automata' },
    c.env.JWT_SECRET
  );
  const response = await sendEmail(
    'nakarnakamu@gmail.com',
    'Hello World',
    authToken
  );
  return c.json({ message: response });
});

app.get('/removeSingle', async (c) => {
  const redis = c.get('redis');
  const batchSize = 1; // Define the number of messages to process at once
  const messages = await redis.lrange('PENDING_MESSAGES', 0, batchSize - 1);
  await redis.lrem('PENDING_MESSAGES', 1, messages[0]);
});
app.get('/run', async (c) => {
  let prisma: PrismaClient = c.get('prisma');
  const redis = c.get('redis');

  const authToken = await sign(
    { message: 'Email sending Services for Automata' },
    c.env.JWT_SECRET
  );

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
      const body = (currentAction.metadata as JsonObject)?.body; //body: 'You just received {comment.amount} as Bounty'
      const to = (currentAction.metadata as JsonObject)?.email; //comment.email
      const zapMetaData = zapRunDetails?.metadata; //{ comment: { email: 'nakarnakamu@gmail.com', amount: '$5' } }
      // const emailMessage = parser(body as string,zapMetaData?.comment as JsonObject);
      // const emailAddress = parser(to as string,zapMetaData?.comment as JsonObject);
      const emailMessage = parser(body as string, zapMetaData as JsonObject);
      const emailAddress = parser(to as string, zapMetaData as JsonObject);
      console.log('final message', emailMessage);
      console.log('final email', emailAddress);
      // send email
      console.log(
        `Sending out email to ${emailAddress} with message ${emailMessage}`
      );
      await sendEmail(emailAddress, emailMessage, authToken);

      // since current action is done so delete the messsage form redis
      // remove the message from the redis after action
      await redis.lrem('PENDING_MESSAGES', 1, message);
    }

    if (currentAction?.type.name == 'github') {
      // do github actions
    }

    // check if it is the last action
    const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
    console.log('lastStage', lastStage);
    if (lastStage == stage) {
      // last stage so delete the message after action
    } else {
      console.log('adding the message to the redis');
      produceSingleMessage(prisma, redis, { zapRunId, stage: stage + 1 });
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
