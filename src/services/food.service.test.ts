import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockGetRandom = mock();

mock.module('@/repositories/food.repository', () => ({
  foodRepository: {
    getRandom: mockGetRandom,
  },
}));

const { foodService } = await import('./food.service');

describe('FoodService', () => {
  beforeEach(() => {
    mockGetRandom.mockReset();
  });

  describe('getRandoms', () => {
    it('should call repository.getRandom with correct limit and return result', async () => {
      const limit = 5;
      const expectedResult = [
        {
          id: '1',
          name: 'Apple',
          recipe: 'Wash and eat',
          image: 'apple.jpg',
          ingredient: 'Apple',
        },
      ];

      mockGetRandom.mockResolvedValue(expectedResult);

      const result = await foodService.getRandoms(limit);

      expect(mockGetRandom).toHaveBeenCalledWith(limit);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const error = new Error('Database error Occurred');
      mockGetRandom.mockRejectedValue(error);

      await expect(foodService.getRandoms(5)).rejects.toThrow(
        'Database error Occurred',
      );
    });
  });
});
