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

const mockHealthyFoods = { name: 'healthy_foods_table' };
mock.module('@/lib/db/schema', () => ({
  healthyFoods: mockHealthyFoods,
  trivias: {},
  user: {},
}));

mock.module('drizzle-orm', () => ({
  sql: mockSql,
  eq: mock(),
}));

const { foodRepository } = await import('./food.repository');

describe('FoodRepository', () => {
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
          name: 'Apple',
          recipe: 'Eat it',
          image: 'url',
          ingredient: 'Apple',
        },
      ];
      const mockSqlReturn = 'SQL_RANDOM';

      mockLimit.mockResolvedValue(expectedResult);
      mockSql.mockReturnValue(mockSqlReturn);

      const result = await foodRepository.getRandom(limit);

      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(mockHealthyFoods);
      expect(mockSql).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalledWith(mockSqlReturn);
      expect(mockLimit).toHaveBeenCalledWith(limit);
      expect(result).toBe(expectedResult);
    });
  });
});
