import { foodService } from '@/services/food.service';

export const getRandomFoods = async (limit: number = 6) => {
  return await foodService.getRandoms(limit);
};
