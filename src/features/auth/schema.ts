import * as z from 'zod';

export const signInBodySchema = z.object({
  email: z
    .email('The credential must be a valid email address')
    .describe('User email'),
  password: z.string().min(6).describe('User password'),
});

export const signUpBodySchema = z.object({
  name: z.string().min(1).describe('User name'),
  email: z
    .email('The credential must be a valid email address')
    .describe('User email'),
  password: z.string().min(6).describe('User password'),
});

export const authorizationTokenSchema = z
  .string()
  .min(1, "Token can't be empty")
  .describe('Authorization token');

export type signInDTO = z.infer<typeof signInBodySchema>;

export type signUpDTO = z.infer<typeof signUpBodySchema>;

export type signOutDTO = z.infer<typeof authorizationTokenSchema>;
