import { createRoute } from '../../lib/route';
import { betterAuthPlugins } from '../../plugins/auth';
import { loggerPlugins } from '../../plugins/logger';
import { openApiPlugins } from '../../plugins/open-api';
import { predictionBodySchema } from './schema';
import * as z from 'zod';
import { predictCHD } from './predict-chd';
import { auth } from '../../lib/auth';
import { authorizationTokenSchema } from '../auth/schema';

const CHDPredictionFeature = createRoute('/prediction', 'prediction')
  .use(betterAuthPlugins)
  .use(openApiPlugins)
  .use(loggerPlugins)
  .post(
    '/',
    async ({ body, set, headers, log }) => {
      // get user session
      const session = await auth.api.getSession({
        headers: {
          authorization: headers.authorization!,
        },
      });
      const userId = session!.user.id;

      // execute use-case
      log.info({ userId });
      const risk = await predictCHD(body, userId);

      set.status = 200;
      return {
        message: 'Prediction success',
        error: false,
        data: {
          userId,
          risk,
          date: new Date().toISOString(),
        },
      };
    },
    {
      auth: true,
      detail: {
        summary: 'Predict Coronary Heart Disease (CHD) Risk',
        description:
          'Endpoint to predict the risk of Coronary Heart Disease (CHD) based on user health data.',
        tags: ['AI Services'],
      },
      body: predictionBodySchema,
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z.object({
          userId: z.string().describe('ID of the user'),
          risk: z.number().describe('Predicted CHD risk percentage'),
          date: z.string().describe('Timestamp of the prediction'),
        }),
      }),
    },
  );

export default CHDPredictionFeature;
