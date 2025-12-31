import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { edenTreaty } from '@elysiajs/eden';
import { createApp } from '@/app';
import { db } from '@/lib/db/client';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/lib/db/schema';
import { logger } from '@/plugins/logger';
import type { predictionDTO } from '@/features/prediction/schema';

const app = createApp().listen(3000);
const api = edenTreaty<typeof app>('http://localhost:3000');
let token: string;

const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'securepassword',
};

describe('Auth Endpoint', () => {
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

    await api.auth.register.post({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    });

    await api.auth.login
      .post({
        email: testUser.email,
        password: testUser.password,
      })
      .then(({ data }) => {
        token = data!.data.token;
      });
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

  describe('POST /prediction', () => {
    it('should predict successfully', async () => {
      const testData = {
        sex: 'male',
        age: 45,
        cigsPerday: 100,
        BPMeds: true,
        prevalentStroke: true,
        prevalentHyp: false,
        diabetes: true,
        totChol: 200,
        sysBP: 120,
        diaBP: 80,
        height: 1.75,
        weight: 70,
        heartRate: 70,
        glucose: 90,
      } as unknown as predictionDTO;

      const { data, error, status } = await api.prediction.post({
        $fetch: {},
        $query: {},
        $headers: {
          authorization: `Bearer ${token}`,
        },
        ...testData,
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'Prediction success');
      expect(data).toHaveProperty('data.userId');
      expect(data).toHaveProperty('data.risk');
      expect(data).toHaveProperty('data.date');
      expect(data).toHaveProperty('error', false);
    });
  });
});
