import { env } from '@/env';
import { wrap } from '@bogeychan/elysia-logger';
import { Elysia } from 'elysia';
import pino from 'pino';

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : {}),
});

export const loggerPlugins = new Elysia({ name: 'logger' }).use(
  wrap(logger, { autoLogging: true }),
);
