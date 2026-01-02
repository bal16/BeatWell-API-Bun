import { activityRepository, ActivityRepository } from '../repositories/activity.repository';

export class ActivityService {
  private repository: ActivityRepository;
  constructor() {
    this.repository = activityRepository;
  }
  async getRandoms(limit: number) {
    return await this.repository.getRandom(limit);
  }
}

export const activityService = new ActivityService();
