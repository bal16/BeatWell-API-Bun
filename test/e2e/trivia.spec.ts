import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { edenTreaty } from '@elysiajs/eden';
import { createApp } from '@/app';
import { db } from '@/lib/db/client';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/lib/db/schema';
import { logger } from '@/plugins/logger';

const app = createApp().listen(3000);
const api = edenTreaty<typeof app>('http://localhost:3000');
let token: string;

describe('Trivia Endpoint', () => {
  const cleanupDB = async () => {
    await Promise.all([
      db.delete(schema.histories),
      db.delete(schema.healthProfiles),
      db.delete(schema.activities),
      db.delete(schema.healthyFoods),
      db.delete(schema.trivias),
      db.delete(schema.user),
    ]);
    logger.info('Database cleanup completed');
  };

  const signUpUser = async () => {
    await api.auth.register.post({
      name: 'Bun User',
      email: 'bunuser@example.com',
      password: 'securepassword',
    });
  };

  const getToken = async () => {
    const { data } = await api.auth.login.post({
      email: 'bunuser@example.com',
      password: 'securepassword',
    });
    logger.info(
      'User logged in, token obtained' + JSON.stringify(data?.data.token),
    );
    return data?.data.token;
  };

  beforeAll(async () => {
    try {
      await migrate(db, { migrationsFolder: './drizzle' });
      logger.info('Migration successful');
    } catch {
      logger.error('Migration failed');
    } finally {
      await cleanupDB();
    }
  });

  afterAll(async () => {
    await cleanupDB();
  });

  describe('GET /trivias', () => {
    it('should fetch trivia questions successfully', async () => {
      await signUpUser();
      token = (await getToken()) as string;
      const { data, error, status } = await api.trivias.get({
        $headers: {
          authorization: `Bearer ${token}`,
        },
        $query: {},
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'Trivias fetched successfully');
      expect(data).toHaveProperty('error', false);
      expect(data).toHaveProperty('data');
    });

    it('should fail to fetch trivia questions without token', async () => {
      const { data, status } = await api.trivias.get({
        $query: {},
        $headers: {},
      });

      expect(status).toBe(401);
      expect(data).toHaveProperty('message', 'Unauthorized');
      expect(data).toHaveProperty('error', true);
    });
  });
});
