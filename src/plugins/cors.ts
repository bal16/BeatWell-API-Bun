import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';

import { env } from '@/env';

export const corsPlugins = new Elysia({ name: 'cors' }).use(
  cors({
    origin: env.TRUSTED_ORIGINS ?? true, //sebelumnya env.ORIGIN
    credentials: true,
  }),
);
