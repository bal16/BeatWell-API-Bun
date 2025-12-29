import * as z from 'zod';

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export const signOutSchema = z.object({
  token: z.string().min(1),
});

export type signInDTO = z.infer<typeof signInSchema>;

export type signUpDTO = z.infer<typeof signUpSchema>;

export type signOutDTO = z.infer<typeof signOutSchema>;
