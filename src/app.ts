import { Elysia } from 'elysia';
import { corsPlugins } from './plugins/cors';
import { loggerPlugins } from './plugins/logger';
import { openApiPlugins } from './plugins/open-api';
import { betterAuthPlugins } from './plugins/auth';
import authFeature from './features/auth';
import CHDPredictionFeature from './features/prediction';

export const createApp = () => {
  return new Elysia()
    .use(openApiPlugins)
    .use(corsPlugins)
    .use(loggerPlugins)
    .use(betterAuthPlugins)
    .use(authFeature)
    .use(CHDPredictionFeature)
    .get('/', () => ({ status: 'ok', backend: 'tensorflow-wasm' }), {
      detail: {
        summary: 'App Health Check',
        description: 'Health check endpoint to verify server status',
      },
      tags: ['Health Check'],
    });
};
