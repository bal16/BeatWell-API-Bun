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

  describe('POST /auth/register', () => {
    it('should register successfully', async () => {
      const { data, error, status } = await api.auth.register.post({
        name: 'Bun User',
        email: 'bunuser@example.com',
        password: 'securepassword',
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'Register Success');
      expect(data).toHaveProperty('error', false);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const { data, error, status } = await api.auth.login.post({
        email: 'bunuser@example.com',
        password: 'securepassword',
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'Login Success');
      expect(data).toHaveProperty('error', false);
      expect(data).toHaveProperty('data.token');
      expect(data).toHaveProperty('data.id');
      expect(data).toHaveProperty('data.name', 'Bun User');
      expect(data).toHaveProperty('data.email', 'bunuser@example.com');
      token = data!.data.token;
    });

    it('should fail with wrong credentials', async () => {
      const { data, error, status } = await api.auth.login.post({
        email: 'wronguser@example.com',
        password: 'wrongpassword',
      });

      expect(status).toBe(401);
      expect(error).not.toBeNull();
      expect(data).toHaveProperty('message', 'Invalid email or password');
      expect(data).toHaveProperty('error', true);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const { data, error, status } = await api.auth.logout.post({
        $query: {},
        $headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'Logout Success');
      expect(data).toHaveProperty('error', false);
    });

    it('should fail logout without token', async () => {
      const { data, error, status } = await api.auth.logout.post({
        $fetch: {},
        $query: {},
        $headers: {
          authorization: ``,
        },
      });

      expect(status).toBe(400);
      expect(error).not.toBeNull();
      expect(data).toHaveProperty('message', "Token can't be empty");
      expect(data).toHaveProperty('error', true);
    });

    it('should fail logout with invalid token', async () => {
      const { data, error, status } = await api.auth.logout.post({
        $fetch: {
          headers: {
            Authorization: `Bearer invalidtoken`,
          },
        },
        $query: {},
        $headers: {
          authorization: `Bearer invalidtoken`,
        },
      });

      expect(status).toBe(401);
      expect(error).not.toBeNull();
      expect(data).toHaveProperty('message', 'Unauthorized');
      expect(data).toHaveProperty('error', true);
    });
  });
});
