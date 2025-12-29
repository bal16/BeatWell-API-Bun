import { createApp } from './app';
import { logger } from './plugins/logger';

logger.info('⏳ Booting up AI Service...');
// await aiService.initialize();

const app = createApp();

// 3. Baru Listen Port
app
  .listen(3000);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
