import { describe, it, expect, mock, beforeEach } from 'bun:test';

// 1. Mock dependencies
const mockGetAll = mock();

mock.module('@/services/trivia.service', () => ({
  triviaService: {
    getAll: mockGetAll,
  },
}));

// 2. Import feature dynamically to ensure mocks are applied
const { getTrivias } = await import('./get-trivias');

describe('getTrivias', () => {
  beforeEach(() => {
    mockGetAll.mockReset();
  });

  it('should delegate to triviaService.getAll and return result', async () => {
    const expectedResult = [
      { id: '1', trivia: 'Sample trivia information' },
      { id: '2', trivia: 'Another trivia information' },
    ];
    mockGetAll.mockResolvedValue(expectedResult);

    const result = await getTrivias();

    expect(mockGetAll).toHaveBeenCalled();
    expect(result).toBe(expectedResult);
  });

  it('should propagate errors from service', async () => {
    const error = new Error('Database connection failed');
    mockGetAll.mockRejectedValue(error);

    await expect(getTrivias()).rejects.toThrow('Database connection failed');
  });
});
