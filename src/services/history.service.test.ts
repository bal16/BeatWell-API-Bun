import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockFindByUserId = mock();
const mockFindById = mock();
const mockDelete = mock();
const mockSave = mock();

mock.module('@/repositories/history.repository', () => ({
  historyRepository: {
    findByUserId: mockFindByUserId,
    findById: mockFindById,
    delete: mockDelete,
    save: mockSave,
  },
}));

const { historyService } = await import('./history.service');

describe('HistoryService', () => {
  beforeEach(() => {
    mockFindByUserId.mockReset();
    mockFindById.mockReset();
    mockDelete.mockReset();
    mockSave.mockReset();
  });

  describe('indexByUserId', () => {
    it('should call repository.findByUserId and return result', async () => {
      const userId = 'user-123';
      const expectedResult = [
        { id: '1', userId, result: '90%', createdAt: new Date() },
      ];
      mockFindByUserId.mockResolvedValue(expectedResult);

      const result = await historyService.indexByUserId(userId);

      expect(mockFindByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getById', () => {
    it('should call repository.findById and return result', async () => {
      const id = 'history-123';
      const userId = 'user-123';
      const expectedResult = {
        id,
        userId,
        result: '90%',
        createdAt: new Date(),
      };
      mockFindById.mockResolvedValue(expectedResult);

      const result = await historyService.getById(id);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call repository.delete', async () => {
      const id = 'history-123';
      mockDelete.mockResolvedValue(undefined);

      await historyService.delete(id);

      expect(mockDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('record', () => {
    it('should format result and call repository.save', async () => {
      const userId = 'user-123';
      const score = 85;
      const expectedSaveInput = {
        userId,
        result: '85%',
      };
      const expectedResult = { id: 'new-id', ...expectedSaveInput };

      mockSave.mockResolvedValue(expectedResult);

      await historyService.record(userId, score);

      expect(mockSave).toHaveBeenCalledWith(expectedSaveInput);
    });
  });
});
