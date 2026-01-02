import { Elysia } from 'elysia';
import { corsPlugins } from '../plugins/cors';
import { loggerPlugins, logger } from '../plugins/logger';
import { openApiPlugins } from '../plugins/open-api';
import { betterAuthPlugins } from '../plugins/auth';
import authFeature from '../features/auth';
import triviaFeature from '../features/trivias';
import usersFeature from '../features/users';
import CHDPredictionFeature from '../features/prediction';
import chatBotFeature from '../features/chatbot';
import HealthyFoodListFeature from '../features/foods';
import historyFeatures from '../features/histories';
import activitiesFeatures from '../features/activities';

export const createApp = () => {
  return new Elysia()
    .use(openApiPlugins)
    .use(corsPlugins)
    .use(loggerPlugins)
    .use(betterAuthPlugins)
    .use(authFeature)
    .use(triviaFeature)
    .use(usersFeature)
    .use(CHDPredictionFeature)
    .use(chatBotFeature)
    .use(HealthyFoodListFeature)
    .use(historyFeatures)
    .use(activitiesFeatures)
    .onStart(() => {
      // No heavy work here; just log readiness
      logger.info('App initialized.');
    })
    .get('/', () => ({ status: 'ok', backend: 'tensorflow-wasm' }), {
      detail: {
        summary: 'App Health Check',
        description: 'Health check endpoint to verify server status',
      },
      tags: ['Health Check'],
    });
};
