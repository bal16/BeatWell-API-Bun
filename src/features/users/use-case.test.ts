import { describe, it, expect, mock, beforeEach } from 'bun:test';

// 1. Mock dependencies
const mockUpdateUserById = mock();
const mockDeleteUserById = mock();
const mockFindByUserId = mock();

mock.module('@/services/user.service', () => ({
  userService: {
    updateUserById: mockUpdateUserById,
    deleteUserById: mockDeleteUserById,
  },
}));

mock.module('@/repositories/history.repository', () => ({
  historyRepository: {
    findByUserId: mockFindByUserId,
  },
}));

// 2. Import feature dynamically to ensure mocks are applied
const { updateCurrentUser } = await import('./update-current-user');
const { deleteCurrentUser } = await import('./delete-current-user');
const { getCurrentUserHistories } =
  await import('./get-current-user-histories');

describe('User Use Cases', () => {
  beforeEach(() => {
    mockUpdateUserById.mockReset();
    mockDeleteUserById.mockReset();
    mockFindByUserId.mockReset();
  });

  describe('updateCurrentUser', () => {
    it('should call userService.updateUserById with correct arguments', async () => {
      const userId = 'user-123';
      const inputs = { name: 'Updated Name' };

      await updateCurrentUser(userId, inputs as any);

      expect(mockUpdateUserById).toHaveBeenCalledWith(userId, inputs);
    });
  });

  describe('deleteCurrentUser', () => {
    it('should call userService.deleteUserById with correct arguments', async () => {
      const userId = 'user-123';

      await deleteCurrentUser(userId);

      expect(mockDeleteUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCurrentUserHistories', () => {
    it('should return histories from repository', async () => {
      const userId = 'user-123';
      const expectedHistories = [
        {
          id: 'history-1',
          userId: 'user-123',
          result: '80%',
          createdAt: new Date(),
        },
        {
          id: 'history-2',
          userId: 'user-123',
          result: '81%',
          createdAt: new Date(),
        },
      ];
      mockFindByUserId.mockResolvedValue(expectedHistories);

      const result = await getCurrentUserHistories(userId);

      expect(mockFindByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedHistories);
    });
  });
});
