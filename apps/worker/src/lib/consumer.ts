import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis/cloudflare';


export const consumer = async (prisma: PrismaClient, redis: Redis) => {
  console.log('Running consumer task...');
  try {
    // Fetch a batch of messages from Redis
    const batchSize = 10; // Define the number of messages to process at once
    const messages = await redis.lrange('PENDING_MESSAGES', 0, batchSize - 1);

    if (messages.length === 0) {
      console.log('No messages to process. Skipping...');
      return;
    }

    console.log(`Fetched ${messages.length} messages from Redis.`);

    // Process each message
    for (const message of messages) {
      try {
        const parsedMessage = JSON.parse(message);
        const { zapRunId, stage } = parsedMessage;

        console.log(`Processing message with zapRunId: ${zapRunId}, stage: ${stage}`);

        // Perform your business logic (e.g., updating a record in the database)
        await processZapRun(prisma, zapRunId, stage);

        // Remove the processed message from Redis
        await redis.lrem('PENDING_MESSAGES', 1, message);
        console.log(`Processed and removed message: ${message}`);
      } catch (processingError) {
        console.error('Error processing message:', processingError);
      }
    }
  } catch (error) {
    console.error('Error in consumer task:', error);
  }
};

// Example function for processing logic
async function processZapRun(prisma: PrismaClient, zapRunId: string, stage: number) {
  // Perform operations using Prisma
  await prisma.zapRun.update({
    where: { id: zapRunId },
    data: { stage: stage + 1 }, // Increment stage as an example
  });

  console.log(`Processed zapRunId: ${zapRunId} to stage: ${stage + 1}`);
}
