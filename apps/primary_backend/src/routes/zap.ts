import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { Context } from '@repo/db/context';
import { authMiddleware } from '../middleware/auth';
import { ZapCreateSchema } from '@repo/types/export/trigger';
export const zapRouter = new Hono<Context>();

zapRouter.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const parsedData = ZapCreateSchema.safeParse(body);
  const prisma: PrismaClient = c.get('prisma');

  if (!parsedData.success) {
    return c.json({ message: 'Invalid data', error: parsedData }, 411);
  }

  const zapId = await prisma.$transaction(async (tx) => {
    const zap = await prisma.zap.create({
      data: {
        triggerId: '',
        actions: {
          create: parsedData.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
          })),
        },
        userId: Number(c.get('userId')),
      },
    });

    const trigger = await tx.trigger.create({
      data: {
        triggerId: parsedData.data?.availableTriggerId,
        zapId: zap.id,
      },
    });

    const updatedZap = await tx.zap.update({
      where: {
        id: zap.id,
      },
      data: {
        triggerId: trigger.id,
      },
    });
    return updatedZap.id;
  });

  return c.json({ message: 'Zap created', id: zapId }, 201);
});

zapRouter.get('/:zapId', authMiddleware, async (c) => {
  const prisma: PrismaClient = c.get('prisma');
  const zapId = c.req.param('zapId');
  const zaps = await prisma.zap.findMany({
    where: {
      userId: Number(c.get('userId')),
      id: zapId,
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  });
  return c.json({ zaps });
});

zapRouter.get('/', authMiddleware, async (c) => {
  const prisma: PrismaClient = c.get('prisma');
  const zaps = await prisma.zap.findMany({
    where: {
      userId: Number(c.get('userId')),
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  });
  return c.json({ zaps });
});
