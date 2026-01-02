import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockWhere = mock();
const mockFrom = mock(() => ({ where: mockWhere }));
const mockSelect = mock(() => ({ from: mockFrom }));
const mockValues = mock();
const mockInsert = mock(() => ({ values: mockValues }));
const mockDelete = mock(() => ({ where: mockWhere }));
const mockEq = mock();

mock.module('@/lib/db/client', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
  },
}));

const mockHistoriesTable = { userId: 'mock_user_id_col', id: 'mock_id_col' };

mock.module('@/lib/db/schema', () => ({
  histories: mockHistoriesTable,
  user: {},
  trivias: {},
  healthyFoods: {},
}));

mock.module('drizzle-orm', () => ({
  eq: mockEq,
  sql: mock(),
}));

const { historyRepository } = await import('./history.repository');

describe('HistoryRepository', () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockWhere.mockClear();
    mockInsert.mockClear();
    mockValues.mockClear();
    mockDelete.mockClear();
    mockEq.mockClear();
  });

  describe('findByUserId', () => {
    it('should return histories for a user', async () => {
      const userId = 'user-123';
      const expectedResult = [{ id: '1', userId, result: 'Good', createdAt: new Date() }];
      const eqResult = 'eq-result';

      mockEq.mockReturnValue(eqResult);
      mockWhere.mockResolvedValue(expectedResult);

      const result = await historyRepository.findByUserId(userId);

      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(mockHistoriesTable);
      expect(mockEq).toHaveBeenCalledWith(mockHistoriesTable.userId, userId);
      expect(mockWhere).toHaveBeenCalledWith(eqResult);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a single history item', async () => {
      const id = 'history-123';
      const expectedItem = { id, userId: 'user-1', result: 'Good', createdAt: new Date() };
      const eqResult = 'eq-result';

      mockEq.mockReturnValue(eqResult);
      mockWhere.mockResolvedValue([expectedItem]);

      const result = await historyRepository.findById(id);

      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(mockHistoriesTable);
      expect(mockEq).toHaveBeenCalledWith(mockHistoriesTable.id, id);
      expect(mockWhere).toHaveBeenCalledWith(eqResult);
      expect(result).toEqual(expectedItem);
    });
  });

  describe('delete', () => {
    it('should delete history by id', async () => {
      const id = 'history-123';
      const eqResult = 'eq-result';

      mockEq.mockReturnValue(eqResult);

      await historyRepository.delete(id);

      expect(mockDelete).toHaveBeenCalledWith(mockHistoriesTable);
      expect(mockEq).toHaveBeenCalledWith(mockHistoriesTable.id, id);
      expect(mockWhere).toHaveBeenCalledWith(eqResult);
    });
  });

  describe('save', () => {
    it('should insert a new history record', async () => {
      const input = { userId: 'user-123', result: 'Good' };

      await historyRepository.save(input);

      expect(mockInsert).toHaveBeenCalledWith(mockHistoriesTable);
      expect(mockValues).toHaveBeenCalledWith(input);
    });
  });
});
