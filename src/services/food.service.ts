import { foodRepository, FoodRepository } from '@/repositories/food.repository';

export class FoodService {
  private repository: FoodRepository;
  constructor() {
    this.repository = foodRepository;
  }
  async getRandoms(limit: number) {
    return await this.repository.getRandom(limit);
  }
}

export const foodService = new FoodService();
