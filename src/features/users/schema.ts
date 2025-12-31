import * as z from 'zod';

export const updateCurrentUserBodySchema = z.object({
  name: z.string().optional().describe('User name'),
  email: z.email().optional().describe('User email'),
  password: z.string().min(6).optional().describe('User password'),
});

export type updateUserDTO = z.infer<typeof updateCurrentUserBodySchema>;
