import * as z from 'zod';
import { signIn } from './sign-in';
import { signUp } from './sign-up';
import { signOut } from './sign-out';
import {
  signInBodySchema,
  authorizationTokenSchema,
  signUpBodySchema,
} from './schema';
import { openApiPlugins } from '@/plugins/open-api';
import { loggerPlugins } from '@/plugins/logger';
import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';

const authFeature = createRoute('/auth', 'auth')
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
      detail: {
        summary: 'Sign In Endpoint',
        description: 'Endpoint for user authentication and login',
      },
      tags: ['Auth'],
      body: signInBodySchema,
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z.object({
          id: z.string().describe('User ID'),
          name: z.string().describe('User name'),
          email: z.email().describe('User email'),
          token: z.string().describe('Authentication token'),
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
      detail: {
        summary: 'Sign Up Endpoint',
        description: 'Endpoint for new user registration',
      },
      tags: ['Auth'],
      body: signUpBodySchema,
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
      }),
    },
  )
  .post(
    '/logout',
    async ({ headers }) => {
      const token = headers.authorization;
      await signOut(token);
      return { message: 'Logout Success', error: false };
    },
    {
      auth: true,
      detail: {
        summary: 'Sign Out Endpoint',
        description: 'Endpoint for user logout',
      },
      tags: ['Auth'],
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
      }),
    },
  );

export default authFeature;
