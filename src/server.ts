import { createApp } from './app';
import { env, envSummary } from './env';
import { logger } from './plugins/logger';


createApp().listen(env.PORT, ({ hostname, port, protocol }) => {
  logger.info(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`);
  logger.info(envSummary());
});
