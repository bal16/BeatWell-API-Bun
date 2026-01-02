import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockReply = mock();

mock.module('@/services/chatbot.service', () => ({
  chatbotService: {
    reply: mockReply,
  },
}));

const { generateAnswer } = await import('./generate-answer');

describe('generateAnswer', () => {
  beforeEach(() => {
    mockReply.mockReset();
  });

  const question = 'Hi';

  it('should delegate to chatbotService.reply and return result', async () => {
    const expectedResult = 'Paris is the capital of France.';
    mockReply.mockResolvedValue(expectedResult);

    const result = await generateAnswer(question);

    expect(mockReply).toHaveBeenCalledWith(question);
    expect(result).toBe(expectedResult);
  });

  it('should propagate errors from service', async () => {
    const error = new Error('AI Services currently down');
    mockReply.mockRejectedValue(error);

    await expect(generateAnswer(question)).rejects.toThrow(
      'AI Services currently down',
    );
  });
});
