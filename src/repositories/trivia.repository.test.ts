import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockFrom = mock();
const mockSelect = mock(() => ({ from: mockFrom }));

mock.module('@/lib/db/client', () => ({
  db: {
    select: mockSelect,
  },
}));

const mockTrivias = { name: 'trivias_table' };

mock.module('@/lib/db/schema', () => ({
  trivias: mockTrivias,
  healthyFoods: {},
  user: {},
  histories: {},
  activities: {},
}));

const { triviaRepository } = await import('./trivia.repository');

describe('TriviaRepository', () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockFrom.mockClear();
  });

  describe('getAll', () => {
    it('should execute select query on trivias table', async () => {
      const expectedResult = [{ id: '1', trivia: 'Test Question' }];
      mockFrom.mockResolvedValue(expectedResult);

      const result = await triviaRepository.getAll();

      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(mockTrivias);
      expect(result).toBe(expectedResult);
    });
  });
});
