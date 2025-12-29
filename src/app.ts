import { Elysia } from 'elysia';
import authFeature from './features/auth';
import { corsPlugins } from './plugins/cors';
import { loggerPlugins } from './plugins/logger';
import { openApiPlugins } from './plugins/open-api';
import { betterAuthPlugins } from './plugins/auth';
import { InvalidCredentialsError } from './exceptions/InvalidCredentialsError';

export const createApp = () => {
  return new Elysia()
    .use(openApiPlugins)
    .use(corsPlugins)
    .use(loggerPlugins)
    .use(betterAuthPlugins)
    .use(authFeature)
    .get('/', () => ({ status: 'ok', backend: 'tensorflow-wasm' }), {
      detail: { description: 'Health check endpoint to verify server status' },
      tags: ['Health Check'],
    });
};
