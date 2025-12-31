import * as z from 'zod';
import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';
import { loggerPlugins } from '@/plugins/logger';
import { openApiPlugins } from '@/plugins/open-api';
import { authorizationTokenSchema } from '../auth/schema';
import { getTrivias } from './get-trivias';

const triviaFeature = createRoute('/trivias', 'trivia')
  .use(openApiPlugins)
  .use(loggerPlugins)
  .use(betterAuthPlugins)
  .get(
    '/',
    async () => {
      const trivia = await getTrivias();
      return {
        message: 'Trivia question fetched successfully',
        error: false,
        data: trivia,
      };
    },
    {
      auth: true,
      detail: {
        summary: 'Get Trivia Information',
        description: 'Endpoint to retrieve trivia information',
      },
      headers: z.object({
        Authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z.array(
          z.object({
            id: z.string().describe('Trivia ID'),
            trivia: z.string().describe('Trivia information'),
          }),
        ),
      }),
    },
  );

export default triviaFeature;
