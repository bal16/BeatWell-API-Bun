import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockGetRandoms = mock();

mock.module('@/services/activity.service', () => ({
  activityService: {
    getRandoms: mockGetRandoms,
  },
}));

const { getRandomActivities } = await import('./get-random-activities');
describe('getRandomActivities', () => {
  beforeEach(() => {
    mockGetRandoms.mockReset();
  });

  it('should delegate to activityService.getRandoms and return result', async () => {
    const expectedResult = [
      {
        id: '1',
        name: 'Running',
        detail: 'Jogging or running for exercise',
        image: 'running.png',
      },
    ];
    mockGetRandoms.mockResolvedValue(expectedResult);

    const result = await getRandomActivities(6);
    expect(mockGetRandoms).toHaveBeenCalledWith(6);
    expect(result).toBe(expectedResult);
  });

  it('should propagate errors from service', async () => {
    const error = new Error('Database error Occurred');
    mockGetRandoms.mockRejectedValue(error);

    await expect(getRandomActivities(6)).rejects.toThrow(
      'Database error Occurred',
    );
  });
});
