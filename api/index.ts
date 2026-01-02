import { logger } from '../src/plugins/logger';
import { createApp } from '../src/lib/app';

const app = createApp();

export default async function handler(request: Request) {
  logger.info(`${request.method} ${request.url}`);
  return app.fetch(request);
}
