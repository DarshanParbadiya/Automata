// import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { db } from '../lib/db';
import { z } from 'zod';

export const baseRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

baseRouter.get('/', async (c) => {
  const prisma = db(c);
  const users = await prisma.user.findMany();
  console.log(users);
  return c.json({ message: users });
});

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// baseRouter.post('/author', zValidator('json', schema), (c) => {
//   const data = c.req.valid('json');
//   return c.json({
//     success: true,
//     message: `${data.name} is ${data.age}`,
//   });
// });
