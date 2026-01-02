import { chatbotService } from '../../services/chatbot.service';
import type { questionType } from './schema';

export const generateAnswer = async (
  question: questionType,
): Promise<string> => {
  return await chatbotService.reply(question);
};
