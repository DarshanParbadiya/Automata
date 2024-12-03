import { verify } from 'hono/jwt';
import { decode } from 'hono/jwt';
export async function authMiddleware(c: any, next: any) {
  //get the header
  const token = c.req.header('Authorization') as unknown as string;
  if (!token) {
    return c.json({ message: 'You are not Loggedin' }, 401);
  }
  //   verify the token
  try {
    const verified = await verify(token, c.env.JWT_SECRET);
    if (!verified) {
      return c.json({ message: 'Invalid token' }, 401);
    }
    const { header, payload } = decode(token);
    if (!payload) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    c.set('userId', Number(payload.id));
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
}
