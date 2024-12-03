import z from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(4),
});
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
