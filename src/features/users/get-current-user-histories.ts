import { historyRepository } from '@/repositories/history.repository';

export const getCurrentUserHistories = async (currentUserId: string) => {
  // call userservice getCurrentUserHistories
  return await historyRepository.findByUserId(currentUserId);
};
