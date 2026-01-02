import * as z from 'zod';
import { openApiPlugins } from '../../plugins/open-api';
import { loggerPlugins } from '../../plugins/logger';
import { createRoute } from '../../lib/route';
import { betterAuthPlugins } from '../../plugins/auth';
import { authorizationTokenSchema } from '../auth/schema';
import { updateCurrentUserBodySchema } from './schema';
import { updateCurrentUser } from './update-current-user';
import { auth } from '../../lib/auth';
import { deleteCurrentUser } from './delete-current-user';
import { getCurrentUserHistories } from './get-current-user-histories';

const usersFeature = createRoute('/users', 'users')
  .use(openApiPlugins)
  .use(loggerPlugins)
  .use(betterAuthPlugins)
  .patch(
    '/',
    async ({ body, headers }) => {
      const session = await auth.api.getSession({ headers });
      // execute update user use case
      await updateCurrentUser(session!.user.id, body);

      return { message: 'User updated successfully', error: false };
    },
    {
      detail: {
        summary: 'Update Current User Endpoint',
        description:
          'Endpoint to update current user information for the current authenticated user.',
      },
      tags: ['Users'],
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      body: updateCurrentUserBodySchema,
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
      }),
    },
  )
  .delete(
    '/',
    async ({ headers }) => {
      const session = await auth.api.getSession({ headers });
      await deleteCurrentUser(session!.user.id);
      return { message: 'User deleted successfully', error: false };
    },
    {
      detail: {
        summary: 'Delete Current User Endpoint',
        description:
          'Endpoint to delete the current authenticated user from the system.',
      },
      tags: ['Users'],
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
      }),
    },
  )
  .get(
    '/histories',
    async ({ headers }) => {
      const session = await auth.api.getSession({ headers });
      const userId = session!.user.id;

      // execute get user histories use case
      const histories = await getCurrentUserHistories(userId);

      return {
        message: 'User histories retrieved successfully',
        error: false,
        histories: histories.map((history) => ({
          id: history.id,
          result: history.result,
          last_checked: history.createdAt.toISOString(),
        })),
      };
    },
    {
      detail: {
        summary: 'Get Current User\'s CHD Risk Histories Endpoint',
        description:
          'Endpoint to retrieve the histories of checked CHD risk associated with the current authenticated user.',
      },
      tags: ['Users'],
      headers: z.object({
        authorization: authorizationTokenSchema,
      }),
      response: z.object({
        message: z.string().describe('Response message'),
        error: z.boolean().describe('Indicates if there was an error'),
        histories: z
          .array(
            z.object({
              id: z.string().describe('History ID'),
              result: z.string().describe('Action performed'),
              last_checked: z.string().describe('Timestamp of the action'),
            }),
          )
          .describe('List of user histories'),
      }),
    },
  );
export default usersFeature;
