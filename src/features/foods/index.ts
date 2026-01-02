import * as z from 'zod';
import { createRoute } from '@/lib/route';
import { betterAuthPlugins } from '@/plugins/auth';
import { loggerPlugins } from '@/plugins/logger';
import { openApiPlugins } from '@/plugins/open-api';
import { authorizationTokenSchema } from '../auth/schema';
import { getRandomFoods } from './get-random-foods';

const HealthyFoodListFeature = createRoute('/foods', 'foods')
  .use(betterAuthPlugins)
  .use(openApiPlugins)
  .use(loggerPlugins)
  .get(
    '/',
    async ({ query }) => {
      const foodList = await getRandomFoods(query?.limit);
      return {
        message: 'Healthy food list fetched successfully',
        error: false,
        data: foodList,
      };
    },
    {
      auth: true,
      detail: {
        summary: 'Get Healthy Food List',
        description:
          'Retrieve a list of healthy food items randomly selected from the database.',
        tags: ['Healthy Lifestyle'],
      },
      query: z.object({
        limit: z.coerce
          .number<number>()
          .optional()
          .describe('Number of food items to retrieve (default is 6)'),
      }),
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        data: z.array(
          z.object({
            id: z.string().describe('ID of the food item'),
            name: z.string().describe('Name of the food item'),
            recipe: z.string().describe('Recipe of the food item'),
            image: z.string().describe('Image URL of the food item'),
            ingredient: z.string().describe('Ingredients of the food item'),
          }),
        ),
      }),
    },
  );

export default HealthyFoodListFeature;
