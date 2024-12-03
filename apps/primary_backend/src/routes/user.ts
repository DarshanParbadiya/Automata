import { useRouter } from 'next/navigation';
import { PrismaClient } from '@prisma/client/edge';
import { Context } from '@repo/db/context';
import { Hono } from 'hono';
import { signUpSchema, signInSchema } from '@repo/types/export/user';
import { PrimaryExpression } from 'typescript';
// import { hash, compare } from 'bcrypt';
import { hashSync, compareSync } from 'bcrypt-edge';

import { decode, sign, verify } from 'hono/jwt';
import { saltRounds } from '../lib/config';
import { authMiddleware } from '../middleware/auth';

export const userRouter = new Hono<Context>();

userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  // try {
  //   const parsedData = await signUpSchema.parse(body);
  // } catch (e) {
  //   return c.json({ message: 'Invalid data', error: e });
  // }
  const parsedData = signUpSchema.safeParse(body);

  if (!parsedData.success) {
    return c.json({ message: 'Invalid data', error: parsedData }, 411);
  }

  const prisma: PrismaClient = c.get('prisma');
  const findUser = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });
  if (findUser) {
    return c.json({ message: 'User already exists' });
  }
  const hashedPassword = hashSync(parsedData.data.password, saltRounds);
  const user = await prisma.user.create({
    data: {
      name: parsedData.data.name,
      email: parsedData.data.email,
      password: hashedPassword,
    },
  });

  // todo await sendEmail(user.email, 'Welcome to our platform');

  return c.json(
    { message: 'User created', user: { email: user.email, name: user.name } },
    201
  );
});

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const parsedData = signInSchema.safeParse(body);
  if (!parsedData.success) {
    return c.json({ message: 'Invalid data' });
  }
  const prisma: PrismaClient = c.get('prisma');
  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });
  if (!user) {
    return c.json({ message: 'User Not Found' });
  }

  // compare password with hashed password
  const isPasswordMatch = compareSync(parsedData.data.password, user.password);
  if (!isPasswordMatch) {
    return c.json({ message: 'Invalid credentials' });
  }
  const payload = {
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
  };
  console.log({ id: user.id, email: user.email });
  const token = await sign(
    { id: user.id, email: user.email },
    c.env.JWT_SECRET
  );
  return c.json({ token, payload });
});

userRouter.get('/user', authMiddleware, async (c) => {
  const id = c.get('userId');
  const prisma: PrismaClient = c.get('prisma');

  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      name: true,
      email: true,
    },
  });
  console.log(user);
  return c.json({ user });
});

// userRouter.get('/auth', authMiddleware);
