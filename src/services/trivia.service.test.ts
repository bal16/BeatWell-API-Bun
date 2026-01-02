import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockGetAll = mock();

mock.module('@/repositories/trivia.repository', () => ({
  triviaRepository: {
    getAll: mockGetAll,
  },
}));

const { triviaService } = await import('./trivia.service');

describe('TriviaService', () => {
  beforeEach(() => {
    mockGetAll.mockReset();
  });

  describe('getAll', () => {
    it('should call repository.getAll and return result', async () => {
      const expectedResult = [
        { id: '1', trivia: 'Q1' },
        { id: '2', trivia: 'Q2' },
      ];

      mockGetAll.mockResolvedValue(expectedResult);

      const result = await triviaService.getAll();

      expect(mockGetAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const error = new Error('Database error');
      mockGetAll.mockRejectedValue(error);

      await expect(triviaService.getAll()).rejects.toThrow('Database error');
    });
  });
});
