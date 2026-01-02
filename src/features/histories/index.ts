import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';
import { loggerPlugins } from '@/plugins/logger';
import { openApiPlugins } from '@/plugins/open-api';
// import { getHistories } from './get-histories';
import * as z from 'zod';
import { authorizationTokenSchema } from '../auth/schema';
import { getHistoryById } from './get-history-by-id';
import { deleteHistoryById } from './delete-history-by-id';

const historyFeatures = createRoute('/histories', 'histories')
  .use(betterAuthPlugins)
  .use(openApiPlugins)
  .use(loggerPlugins)
  .get(
    '/:id',
    async ({ params }) => {
      // execute use-case "getHistoryById"
      const history = await getHistoryById(params.id);

      return {
        message: 'History fetched successfully',
        error: false,
        data: history,
      };
    },
    {
      auth: true,
      detail: {
        description: 'Get a history by ID',
        summary: 'Get History by ID',
        tags: ['Users'],
      },
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      params: z.object({
        id: z.string().describe('History ID'),
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Error indicator'),
        data: z.object({
          id: z.string().describe('History ID'),
          userId: z.string().describe('User ID'),
          result: z.string().describe('Result data'),
          last_checked: z.string().describe('Last checked timestamp'),
        }),
      }),
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      // execute use-case "DeleteHistoryById"
      await deleteHistoryById(params.id);

      return {
        message: 'History deleted successfully',
        error: false,
      };
    },
    {
      auth: true,
      detail: {
        description: 'Delete a history by ID',
        summary: 'Delete History',
        tags: ['Users'],
      },
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      params: z.object({
        id: z.string().describe('History ID'),
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Error indicator'),
      }),
    },
  );

export default historyFeatures;
