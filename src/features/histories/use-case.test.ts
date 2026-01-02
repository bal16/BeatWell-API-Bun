import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockGetById = mock();
const mockDelete = mock();

mock.module('@/services/history.service', () => ({
  historyService: {
    getById: mockGetById,
    delete: mockDelete,
  },
}));

const { getHistoryById } = await import('./get-history-by-id');
const { deleteHistoryById } = await import('./delete-history-by-id');

describe('History Use Cases', () => {
  beforeEach(() => {
    mockGetById.mockReset();
    mockDelete.mockReset();
  });

  describe('getHistoryById', () => {
    it('should delegate to historyService.getById and return result', async () => {
      const id = 'history-123';
      const serviceResult = {
        id,
        result: '90%',
        userId: 'user-1',
        createdAt: new Date(),
      };
      mockGetById.mockResolvedValue(serviceResult);

      const result = await getHistoryById(id);

      expect(mockGetById).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        id: serviceResult.id,
        result: serviceResult.result,
        userId: serviceResult.userId,
        last_checked: serviceResult.createdAt.toISOString(),
      });
    });

    it('should propagate errors from service', async () => {
      const error = new Error('History not found');
      mockGetById.mockRejectedValue(error);

      await expect(getHistoryById('invalid-id')).rejects.toThrow(
        'History not found',
      );
    });
  });

  describe('deleteHistoryById', () => {
    it('should delegate to historyService.delete', async () => {
      const id = 'history-123';
      mockDelete.mockResolvedValue(undefined);

      await deleteHistoryById(id);

      expect(mockDelete).toHaveBeenCalledWith(id);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Delete failed');
      mockDelete.mockRejectedValue(error);

      await expect(deleteHistoryById('invalid-id')).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
