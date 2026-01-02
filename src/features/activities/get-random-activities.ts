import { activityService } from '@/services/activity.service';

export const getRandomActivities = (limit: number = 10) => {
  // call service
  return activityService.getRandoms(limit);
};

