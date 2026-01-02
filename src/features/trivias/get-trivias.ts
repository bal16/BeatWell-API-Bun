import { triviaService } from '../../services/trivia.service';

export const getTrivias = async () => {
  return await triviaService.getAll();
};
