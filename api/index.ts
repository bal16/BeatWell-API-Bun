import { logger } from '../src/plugins/logger';
import { createApp } from '../src/lib/app';

const app = createApp();

logger.info('Starting the BeatWell API server...');

export default app;
