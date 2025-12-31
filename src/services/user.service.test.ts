import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockPatchById = mock();
const mockDeleteById = mock();

mock.module('@/repositories/user.repository', () => ({
  userRepository: {
    patchById: mockPatchById,
    deleteById: mockDeleteById,
  },
}));

const { userService } = await import('./user.service');

describe('UserService', () => {
  beforeEach(() => {
    mockPatchById.mockReset();
    mockDeleteById.mockReset();
  });

  describe('updateUserById', () => {
    it('should call repository.patchById with correct parameters', async () => {
      const id = 'user-123';
      const inputs = { name: 'Updated Name' };

      await userService.updateUserById(id, inputs as any);

      expect(mockPatchById).toHaveBeenCalledWith(id, inputs);
    });
  });

  describe('deleteUserById', () => {
    it('should call repository.deleteById with correct parameters', async () => {
      const id = 'user-123';

      await userService.deleteUserById(id);

      expect(mockDeleteById).toHaveBeenCalledWith(id);
    });
  });
});
