import { historyService } from '../../services/history.service';

export const getHistoryById = async (id: string) => {
  // Placeholder implementation
  // In a real implementation, this would fetch the history from a database
  const history = await historyService.getById(id);

  const last_checked = history.createdAt.toISOString();

  return {
    id: history.id,
    userId: history.userId,
    result: history.result,
    last_checked,
  };
};
