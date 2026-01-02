import { createRoute } from '../../lib/route';
import { betterAuthPlugins } from '../../plugins/auth';
import { loggerPlugins } from '../../plugins/logger';
import { openApiPlugins } from '../../plugins/open-api';
import * as z from 'zod';
import { authorizationTokenSchema } from '../auth/schema';
import { questionSchema } from './schema';
import { generateAnswer } from './generate-answer';

const chatBotFeature = createRoute('/chat', 'chat')
  .use(betterAuthPlugins)
  .use(openApiPlugins)
  .use(loggerPlugins)
  .post(
    '/',
    async ({ body, set }) => {
      // execute use-case
      const answer = await generateAnswer(body.question);

      set.status = 200;
      return {
        message: 'Question answered successfully',
        error: false,
        data: {
          answer,
        },
      };
    },
    {
      auth: true,
      detail: {
        summary: 'Chat with the AI Chatbot',
        description:
          'Endpoint to interact with the AI Chatbot by asking questions.',
        tags: ['AI Services'],
      },
      body: z.object({
        question: questionSchema,
      }),
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z.object({
          answer: z.string().describe('Answer from the chatbot'),
        }),
      }),
    },
  );

export default chatBotFeature;
