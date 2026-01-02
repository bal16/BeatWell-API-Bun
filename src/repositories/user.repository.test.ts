import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockWhere = mock();
const mockSet = mock(() => ({ where: mockWhere }));
const mockUpdate = mock(() => ({ set: mockSet }));
const mockDelete = mock(() => ({ where: mockWhere }));
const mockEq = mock();

mock.module('@/lib/db/client', () => ({
  db: {
    update: mockUpdate,
    delete: mockDelete,
  },
}));

const mockUserTable = { id: 'mock_user_id_col' };
mock.module('@/lib/db/schema', () => ({
  user: mockUserTable,
  trivias: {},
  healthyFoods: {},
  histories: {},
  activities: {}
}));

mock.module('drizzle-orm', () => ({
  eq: mockEq,
  sql: mock(),
}));

const { userRepository } = await import('./user.repository');

describe('UserRepository', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockSet.mockClear();
    mockWhere.mockClear();
    mockDelete.mockClear();
    mockEq.mockClear();
  });

  describe('patchById', () => {
    it('should call db.update with correct arguments', async () => {
      const id = 'user-123';
      const inputs = { name: 'Updated Name' };
      const eqResult = 'eq-result';
      mockEq.mockReturnValue(eqResult);

      await userRepository.patchById(id, inputs as any);

      expect(mockUpdate).toHaveBeenCalledWith(mockUserTable);
      expect(mockSet).toHaveBeenCalledWith(inputs);
      expect(mockEq).toHaveBeenCalledWith(mockUserTable.id, id);
      expect(mockWhere).toHaveBeenCalledWith(eqResult);
    });
  });

  describe('deleteById', () => {
    it('should call db.delete with correct arguments', async () => {
      const id = 'user-123';
      const eqResult = 'eq-result';
      mockEq.mockReturnValue(eqResult);

      await userRepository.deleteById(id);

      expect(mockDelete).toHaveBeenCalledWith(mockUserTable);
      expect(mockEq).toHaveBeenCalledWith(mockUserTable.id, id);
      expect(mockWhere).toHaveBeenCalledWith(eqResult);
    });
  });
});
