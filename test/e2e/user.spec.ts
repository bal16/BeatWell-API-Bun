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

describe('User Endpoint', () => {
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
      await signUpUser();
      token = (await getToken()) as string;
    }
  });

  afterAll(async () => {
    await cleanupDB();
  });

  describe('PATCH /users', () => {
    it('should update user successfully', async () => {
      const { data, error, status } = await api.users.patch({
        name: 'Updated Bun User',
        $headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'User updated successfully');
      expect(data).toHaveProperty('error', false);
    });

    it('should fail to update user without token', async () => {
      const { data, status } = await api.users.patch({
        $headers: {},
        name: 'Updated Bun User',
      });

      expect(status).not.toBe(200);
      expect(data).toHaveProperty('error', true);
    });
  });

  describe('GET /users/histories', () => {
    it('should fetch user histories successfully', async () => {
      const { data, error, status } = await api.users.histories.get({
        $headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty(
        'message',
        'User histories retrieved successfully',
      );
      expect(data).toHaveProperty('error', false);
      expect(data).toHaveProperty('histories');
    });

    it('should fail to fetch histories without token', async () => {
      const { data, status } = await api.users.histories.get({
        $headers: {},
      });

      expect(status).not.toBe(200);
      expect(data).toHaveProperty('error', true);
    });
  });

  describe('DELETE /users', () => {
    it('should delete user successfully', async () => {
      const { data, error, status } = await api.users.delete({
        $headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toHaveProperty('message', 'User deleted successfully');
      expect(data).toHaveProperty('error', false);
    });

    it('should fail to delete user without token', async () => {
      const { data, status } = await api.users.delete({
        $headers: {},
      });

      expect(status).not.toBe(200);
      expect(data).toHaveProperty('error', true);
    });
  });
});
