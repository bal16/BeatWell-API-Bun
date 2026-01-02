import {
  triviaRepository,
  TriviaRepository,
} from '@/repositories/trivia.repository';

export class TriviaService {
  private repository: TriviaRepository;
  constructor() {
    this.repository = triviaRepository;
  }
  async getAll() {
    return await this.repository.getAll();
  }
}

export const triviaService = new TriviaService();
