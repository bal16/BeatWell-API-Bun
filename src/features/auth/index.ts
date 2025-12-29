import { Elysia, status } from 'elysia';
import * as z from 'zod';
import { signIn } from './sign-in';
import { signUp } from './sign-up';
import { signOut } from './sign-out';
import { signInSchema, signOutSchema, signUpSchema } from './schema';
import { openApiPlugins } from '@/plugins/open-api';
import { loggerPlugins } from '@/plugins/logger';
import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';

const authFeature = createRoute('/auth')
  .use(openApiPlugins)
  .use(loggerPlugins)
  .use(betterAuthPlugins)
  .post(
    '/login',
    async ({ body, set }) => {
      const { email, password } = body;
      const session = await signIn({ email, password });
      set.status = 200;

      return {
        message: 'Login Success',
        error: false,
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          token: session.token,
        },
      };
    },
    {
      detail: { description: 'User login endpoint' },
      tags: ['Auth'],
      body: signInSchema,
      response: z.object({
        message: z.string(),
        error: z.boolean(),
        data: z.object({
          id: z.string(),
          name: z.string(),
          email: z.email(),
          token: z.string(),
        }),
      }),
    },
  )
  .post(
    '/register',
    async ({ body, log }) => {
      const { name, email, password } = body;
      const user = await signUp({ name, email, password });
      log.info(`Registered user:${JSON.stringify(user)}`);
      return { message: 'Register Success', error: false };
    },
    {
      detail: { description: 'User registration endpoint' },
      tags: ['Auth'],
      body: signUpSchema,
      response: z.object({
        message: z.string(),
        error: z.boolean(),
      }),
    },
  )
  .post(
    '/logout',
    async () => {
      //  await signOut({token});
      return { message: 'Logout Success', error: false };
    },
    {
      auth: true,
      detail: { description: 'User logout endpoint' },
      tags: ['Auth'],
      // headers: z.object({
      //   authorization: z.string(),
      // }),
      response: z.object({
        message: z.string(),
        error: z.boolean(),
      }),
    },
  );

export default authFeature;
