import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockLimit = mock();
const mockOrderBy = mock(() => ({ limit: mockLimit }));
const mockFrom = mock(() => ({ orderBy: mockOrderBy }));
const mockSelect = mock(() => ({ from: mockFrom }));
const mockSql = mock();

mock.module('@/lib/db/client', () => ({
  db: {
    select: mockSelect,
  },
}));

const mockActivities = { name: 'activities_table' };
mock.module('@/lib/db/schema', () => ({
  activities: mockActivities,
  trivias: {},
  user: {},
  histories: {},
  healthyFoods: {},
}));

mock.module('drizzle-orm', () => ({
  sql: mockSql,
  eq: mock(),
}));

const { activityRepository } = await import('./activity.repository');

describe('ActivityRepository', () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockOrderBy.mockClear();
    mockLimit.mockClear();
    mockSql.mockClear();
  });

  describe('getRandom', () => {
    it('should execute select query with random order and limit', async () => {
      const limit = 10;
      const expectedResult = [
        {
          id: '1',
          name: 'Running',
          image: 'running.png',
          detail: 'Jogging or running for exercise',
        },
      ];
      const mockSqlReturn = 'SQL_RANDOM';

      mockLimit.mockResolvedValue(expectedResult);
      mockSql.mockReturnValue(mockSqlReturn);

      const result = await activityRepository.getRandom(limit);

      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(mockActivities);
      expect(mockSql).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalledWith(mockSqlReturn);
      expect(mockLimit).toHaveBeenCalledWith(limit);
      expect(result).toBe(expectedResult);
    });
  });
});
