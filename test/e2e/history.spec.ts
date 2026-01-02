import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { edenTreaty } from '@elysiajs/eden';
import { createApp } from '@/lib/app';
import { db } from '@/lib/db/client';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/lib/db/schema';
import { logger } from '@/plugins/logger';
import { eq } from 'drizzle-orm';

const app = createApp().listen(3001);
const api = edenTreaty<typeof app>('http://localhost:3001');

describe('History Endpoint', () => {
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

  const signUpUser = async (email: string) => {
    await api.auth.register.post({
      name: 'Bun User',
      email,
      password: 'securepassword',
    });
  };

  const getToken = async (email: string) => {
    const { data } = await api.auth.login.post({
      email,
      password: 'securepassword',
    });
    return data?.data.token;
  };

  const getUserId = async (email: string) => {
    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email));
    return result[0]?.id;
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

  describe('GET /histories/:id', () => {
    it('should fetch history by id successfully', async () => {
      const email = 'history_test_get@example.com';
      await signUpUser(email);
      const token = (await getToken(email)) as string;
      const userId = await getUserId(email);

      if (!userId) throw new Error('User not found');

      const historyId = 'history-123';
      await db.insert(schema.histories).values({
        id: historyId,
        userId,
        result: 'Healthy',
      });

      const { data, error, status } = await api.histories[historyId].get({
        $headers: {
          authorization: `Bearer ${token}`,
        },
        $query: {},
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'History fetched successfully');
      expect(data).toHaveProperty('error', false);
      expect(data?.data).toHaveProperty('id', historyId);
      expect(data?.data).toHaveProperty('userId', userId);
    });

    it('should fail to fetch history without token', async () => {
      const { data, status } = await api.histories['some-id'].get({
        $headers: {},
        $query: {},
      });

      expect(status).toBe(401);
      expect(data).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('DELETE /histories/:id', () => {
    it('should delete history by id successfully', async () => {
      const email = 'history_test_delete@example.com';
      await signUpUser(email);
      const token = (await getToken(email)) as string;
      const userId = await getUserId(email);

      if (!userId) throw new Error('User not found');

      const historyId = 'history-to-delete';
      await db.insert(schema.histories).values({
        id: historyId,
        userId,
        result: 'To Delete',
      });

      const { data, error, status } = await api.histories[historyId].delete({
        $headers: {
          authorization: `Bearer ${token}`,
        },
        $query: {},
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'History deleted successfully');

      const history = await db
        .select()
        .from(schema.histories)
        .where(eq(schema.histories.id, historyId));

      expect(history.length).toBe(0);
    });
  });
});
