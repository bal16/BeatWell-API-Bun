import * as z from 'zod';

export const questionSchema = z
  .string()
  .describe('Question to ask the chatbot');

export type questionType = z.infer<typeof questionSchema>;
