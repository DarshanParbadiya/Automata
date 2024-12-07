import { decode, sign, verify } from 'hono/jwt';
const generateAuthToken = async (c:any) => {
    const token = await sign(
        {message : "email Sending Service"},
        c.env.JWT_SECRET
      );
}