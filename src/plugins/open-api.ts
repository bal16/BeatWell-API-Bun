import { Elysia } from 'elysia';
import openapi from '@elysiajs/openapi';
import * as z from 'zod';

export const openApiPlugins = new Elysia({ name: 'open-api' }).use(
  openapi({
    documentation: {
      tags: [
        {
          name: 'Auth',
          description: 'Authentication and user management endpoints',
        },
        {
          name: 'AI Services',
          description: 'AI-powered services endpoints',
        },
        {
          name: 'Health Check',
          description: 'Health check endpoints',
        },
      ],
      info: {
        title: 'Beatwell API Documentation',
        description: 'API documentation for Beatwell backend services.',
        version: '1.0.0',
      },
    },
    path: '/docs',
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
  }),
);
