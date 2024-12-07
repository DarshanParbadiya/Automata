import z from 'zod'
import { PrismaClient } from '@prisma/client/edge';
import { redisMessageSchema } from '@repo/types/export/worker';
import { Redis } from '@upstash/redis/cloudflare';
// Producer function
export const producer = async (prisma: PrismaClient, redis: Redis) => {
    console.log('Running producer task...');
    try {
      // console.log('Fetching pending rows from Prisma...');
      const pendingRows = await prisma.zapRunOutbox.findMany({
        where: {},
        take: 10,
      });
  
      // console.log('Pending rows fetched:', pendingRows);
  
      if (pendingRows.length === 0) {
        // console.log('No pending rows found. Skipping processing.');
        return;
      }
  
      // Push messages to Redis
      const messages = pendingRows.map((r) =>
        JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
      );
  
      for (const message of messages) {
        await redis.lpush('PENDING_MESSAGES', message);
      }
  
      console.log(`Added ${messages.length} messages to Redis.`);
  
      // Delete processed rows
      await prisma.zapRunOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map((x) => x.id),
          },
        },
      });
  
      console.log('Processed rows deleted:', pendingRows);
    } catch (error) {
      console.error('Error in producer task:', error);
    }
  };
  
export const produceSingleMessage = async (prisma : PrismaClient,redis : Redis,message : z.infer<typeof redisMessageSchema>) => {
  const parsedData = redisMessageSchema.safeParse(message);
  if (!parsedData.success) {
    console.error('Invalid message:', message);
    return false;
  }
  // const messages = pendingRows.map((r) =>
    const redisItem = JSON.stringify(message)
  // );

  // for array of messages
  // for (const message of messages) {
  //   await redis.lpush('PENDING_MESSAGES', message);
  // }
  // for single message
  await redis.lpush('PENDING_MESSAGES', redisItem);

  console.log(`Added ${redisItem} messages to Redis.`);
}

