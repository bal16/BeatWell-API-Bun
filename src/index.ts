import { logger } from './plugins/logger';
import { createApp } from './lib/app';
import { Elysia } from 'elysia';

const app = createApp();

logger.info('Starting the BeatWell API server...');

export default new Elysia().use(app);
