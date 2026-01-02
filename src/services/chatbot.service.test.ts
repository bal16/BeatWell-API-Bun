import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';

// 1. Mock dependencies
const mockPredict = mock(() => ({
  dataSync: () => [0.9, 0.1],
}));

const mockModel = {
  predict: mockPredict,
};

const mockTf = {
  tensor2d: mock((arr: []) => arr),
  tidy: mock((fn) => fn()),
  getBackend: mock(() => 'cpu'),
  setBackend: mock(() => Promise.resolve()),
  ready: mock(() => Promise.resolve()),
  loadLayersModel: mock(() => Promise.resolve(mockModel)),
};

mock.module('@/lib/tensorflow', () => ({
  default: mockTf,
}));

const mockLogger = {
  info: mock(),
  error: mock(),
};

mock.module('@/plugins/logger', () => ({
  logger: mockLogger,
}));

mock.module('@/env', () => ({
  env: {
    CHATBOT_MODEL_URL: Bun.env.CHATBOT_MODEL_URL || 'file://mock/model.json',
    CHATBOT_INTENTS_URL:
      Bun.env.CHATBOT_INTENTS_URL || 'http://mock/intents.json',
    CHATBOT_WORDS_URL: Bun.env.CHATBOT_WORDS_URL || 'http://mock/words.json',
    CHATBOT_CLASSES_URL:
      Bun.env.CHATBOT_CLASSES_URL || 'http://mock/classes.json',
  },
}));

// Mock fetch globally
const originalFetch = global.fetch;
const mockFetch = mock<typeof originalFetch>();

// 2. Import the service dynamically
const { ChatbotService } = await import('./chatbot.service');

describe('ChatbotService', () => {
  let service: InstanceType<typeof ChatbotService>;

  beforeEach(() => {
    // Reset mocks
    mockTf.loadLayersModel.mockClear();
    mockTf.setBackend.mockClear();
    mockTf.getBackend.mockImplementation(() => 'cpu');
    mockPredict.mockClear();
    mockTf.tensor2d.mockClear();
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();

    mockFetch.mockReset();
    // @ts-expect-error mocking global fetch for tests
    global.fetch = mockFetch;

    // Create fresh instance
    service = new ChatbotService();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should initialize correctly', () => {
    expect(service).toBeInstanceOf(ChatbotService);
  });

  it('should load assets and predict correctly on first call', async () => {
    // Mock fetch responses
    // @ts-expect-error access private property for test
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('intents')) {
        return {
          json: async () => ({
            intents: [
              { tag: 'greeting', responses: ['Hello there!'] },
              { tag: 'goodbye', responses: ['Bye!'] },
            ],
          }),
        };
      }
      if (url.includes('words')) {
        return { json: async () => ['hello', 'bye', 'test'] };
      }
      if (url.includes('classes')) {
        return { json: async () => ['greeting', 'goodbye'] };
      }
      return { json: async () => ({}) };
    });

    // Mock prediction to return index 0 ('greeting')
    mockPredict.mockImplementation(() => ({
      dataSync: () => [0.9, 0.1],
    }));

    const response = await service.reply('Hello test');

    // Verify loading
    expect(mockTf.setBackend).toHaveBeenCalledWith('wasm');
    expect(mockTf.loadLayersModel).toHaveBeenCalledWith(
      Bun.env.CHATBOT_MODEL_URL || 'file://mock/model.json',
    );
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockLogger.info).toHaveBeenCalledWith(
      '⏳ Loading Chatbot Assets...',
    );
    expect(mockLogger.info).toHaveBeenCalledWith('✅ Chatbot Ready');

    // Verify prediction
    expect(mockTf.tensor2d).toHaveBeenCalled();
    expect(mockPredict).toHaveBeenCalled();

    // Verify response
    expect(response).toBe('Hello there!');
  });

  it('should not reload assets if already loaded', async () => {
    // @ts-expect-error access private property for test
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('intents'))
        return { json: async () => ({ intents: [] }) };
      if (url.includes('words')) return { json: async () => [] };
      if (url.includes('classes')) return { json: async () => [] };
      return { json: async () => ({}) };
    });

    // First call
    await service.reply('hi');
    expect(mockTf.loadLayersModel).toHaveBeenCalledTimes(1);

    // Second call
    await service.reply('hi again');
    expect(mockTf.loadLayersModel).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(3); // Only called in first execution
  });

  it('should handle unknown intent (fallback)', async () => {
    // @ts-expect-error access private property for test
    // Mock data
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('intents')) {
        return {
          json: async () => ({
            intents: [{ tag: 'greeting', responses: ['Hi'] }],
          }),
        };
      }
      if (url.includes('words')) return { json: async () => ['hi'] };
      if (url.includes('classes'))
        return { json: async () => ['greeting', 'unknown'] };
      return { json: async () => ({}) };
    });

    // Predict index 1 ('unknown'), which is not in intents list
    mockPredict.mockImplementation(() => ({
      dataSync: () => [0.1, 0.9],
    }));

    const response = await service.reply('something weird');

    expect(response).toBe('Maaf, saya tidak mengerti maksud Anda.');
  });

  it('should throw error if asset loading fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(service.reply('hi')).rejects.toThrow(
      'Gagal load assets chatbot',
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should not set backend if already wasm', async () => {
    mockTf.getBackend.mockReturnValue('wasm');

    // @ts-expect-error access private property for test
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('intents'))
        return { json: async () => ({ intents: [] }) };
      return { json: async () => [] };
    });

    await service.reply('hi');

    expect(mockTf.setBackend).not.toHaveBeenCalled();
  });
});
