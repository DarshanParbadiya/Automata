import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';
import { produceSingleMessage } from './producer';
import { sendEmail } from './email';
import { parser } from './parser';
import { JsonObject } from '@prisma/client/runtime/library';
import { sign } from 'hono/jwt';
import { redisMessageSchema } from '@repo/types/export/worker';

export const consumer = async (
  prisma: PrismaClient,
  redis: Redis,
  JWT_SECRET: string
) => {
  console.log('Running consumer task...');
  try {
    // let prisma: PrismaClient = c.get('prisma');
    // const redis = c.get('redis');

    const authToken = await sign(
      { message: 'Email sending Services for Automata' },
      JWT_SECRET
    );

    console.log('running single time...');
    // Start the producer in a scheduled manner
    const batchSize = 10; // Define the number of messages to process at once
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
    }
  } catch (error) {
    console.error('Error in consumer task:', error);
  }
};

// Example function for processing logic
// async function processZapRun(
//   prisma: PrismaClient,
//   zapRunId: string,
//   stage: number
// ) {
//   // Perform operations using Prisma
//   await prisma.zapRun.update({
//     where: { id: zapRunId },
//     data: { stage: stage + 1 }, // Increment stage as an example
//   });

//   console.log(`Processed zapRunId: ${zapRunId} to stage: ${stage + 1}`);
// }
