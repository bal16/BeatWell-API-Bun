import { Elysia } from 'elysia';
import { corsPlugins } from './plugins/cors';
import { loggerPlugins } from './plugins/logger';
import { openApiPlugins } from './plugins/open-api';
import { betterAuthPlugins } from './plugins/auth';
import authFeature from './features/auth';
import CHDPredictionFeature from './features/prediction';
import triviaFeature from './features/trivias';
import usersFeature from './features/users';
import chatBotFeature from './features/chatbot';
import HealthyFoodListFeature from './features/foods';
import historyFeatures from './features/histories';
import activitiesFeatures from './features/activities';

export const createApp = () => {
  return new Elysia()
    .use(openApiPlugins)
    .use(corsPlugins)
    .use(loggerPlugins)
    .use(betterAuthPlugins)
    .use(authFeature)
    .use(CHDPredictionFeature)
    .use(triviaFeature)
    .use(usersFeature)
    .use(chatBotFeature)
    .use(HealthyFoodListFeature)
    .use(historyFeatures)
    .use(activitiesFeatures)
    .get('/', () => ({ status: 'ok', backend: 'tensorflow-wasm' }), {
      detail: {
        summary: 'App Health Check',
        description: 'Health check endpoint to verify server status',
      },
      tags: ['Health Check'],
    });
};
