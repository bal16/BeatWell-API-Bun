import {
  historyRepository,
  HistoryRepository,
} from '../repositories/history.repository';

export class HistoryService {
  private repository: HistoryRepository;
  constructor() {
    this.repository = historyRepository;
  }

  public async indexByUserId(userId: string) {
    return await this.repository.findByUserId(userId);
  }

  public async getById(id: string) {
    return await this.repository.findById(id);
  }

  public async delete(id: string) {
    return await this.repository.delete(id);
  }

  public async record(userId: string, result: number) {
    const formattedResult = `${result}%`;

    await historyRepository.save({
      userId,
      result: formattedResult,
    });
  }
}

export const historyService = new HistoryService();
