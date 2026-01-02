import { historyService } from '@/services/history.service';

export const deleteHistoryById = async (id: string) => {
  return await historyService.delete(id);
};
