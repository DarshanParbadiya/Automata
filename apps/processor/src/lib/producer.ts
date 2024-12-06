
import { PrismaClient } from '@prisma/client/edge';
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
      await /* `prisma` is a PrismaClient instance that is used to interact with the database. In the
      provided code snippet, `prisma` is used to fetch pending rows from a specific table
      (`zapRunOutbox`) in the database, delete processed rows, and perform database operations
      related to the `zapRunOutbox` table. */
      prisma.zapRunOutbox.deleteMany({
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
  