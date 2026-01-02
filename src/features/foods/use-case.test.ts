import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockGetRandoms = mock();

mock.module('@/services/food.service', () => ({
  foodService: {
    getRandoms: mockGetRandoms,
  },
}));

const { getRandomFoods } = await import('./get-random-foods');
describe('getRandomFoods', () => {
  beforeEach(() => {
    mockGetRandoms.mockReset();
  });

  it('should delegate to foodService.getRandoms and return result', async () => {
    const expectedResult = [
      {
        id: '1',
        name: 'Apple',
        recipe: 'Slice and eat',
        image: 'http://example.com/apple.jpg',
        ingredient: 'Apple',
      },
    ];
    mockGetRandoms.mockResolvedValue(expectedResult);

    const result = await getRandomFoods(6);
    expect(mockGetRandoms).toHaveBeenCalledWith(6);
    expect(result).toBe(expectedResult);
  });

  it('should propagate errors from service', async () => {
    const error = new Error('Database error Occurred');
    mockGetRandoms.mockRejectedValue(error);

    await expect(getRandomFoods(6)).rejects.toThrow(
      'Database error Occurred',
    );
  });
});
