import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';

const mockGetRandom = mock();

mock.module('@/repositories/activity.repository', () => ({
  activityRepository: {
    getRandom: mockGetRandom,
  },
}));

const { activityService } = await import('./activity.service');

describe('ActivityService', () => {
  beforeEach(() => {
    mockGetRandom.mockReset();
  });

  afterEach(() => {
    mockGetRandom.mockReset();
  });

  describe('getRandoms', () => {
    it('should call repository.getRandom with correct limit and return result', async () => {
      const limit = 5;
      const expectedResult = [
        {
          id: '1',
          name: 'Running',
          image: 'running.png',
          detail: 'Jogging or running for exercise',
        },
      ];

      mockGetRandom.mockResolvedValue(expectedResult);

      const result = await activityService.getRandoms(limit);

      expect(mockGetRandom).toHaveBeenCalledWith(limit);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const error = new Error('Database error Occurred');
      mockGetRandom.mockRejectedValue(error);

      await expect(activityService.getRandoms(5)).rejects.toThrow(
        'Database error Occurred',
      );
    });
  });
});
