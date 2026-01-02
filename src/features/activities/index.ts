import * as z from 'zod';
import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';
import { loggerPlugins } from '@/plugins/logger';
import { openApiPlugins } from '@/plugins/open-api';
import { getRandomActivities } from './get-random-activities';

const activitiesFeatures = createRoute('/activities', 'activities')
  .use(openApiPlugins)
  .use(loggerPlugins)
  .use(betterAuthPlugins)
  .get(
    '/',
    async ({ query }) => {
      const activities = await getRandomActivities(query?.limit);

      return {
        message: 'Activities fetched successfully',
        error: false,
        data: activities,
      };
    },
    {
      auth: true,
      detail: {
        tags: ['Healthy Lifestyle'],
        summary: 'Get Activities',
        description: 'Retrieve a list of activities.',
      },
      query: z.object({
        limit: z.coerce.number<number>().min(1).max(100).optional().default(10),
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z
          .array(
            z
              .object({
                id: z.string().describe('ID of the activity'),
                name: z.string().describe('Name of the activity'),
                detail: z.string().describe('Details of the activity'),
              })
              .describe('Activity object'),
          )
          .describe('List of activities'),
      }),
    },
  );

export default activitiesFeatures;
