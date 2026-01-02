import { describe, it, expect, mock, beforeEach } from 'bun:test';

// 1. Mock dependencies
const mockPredict = mock(() => ({
  dataSync: () => [0.88],
}));

const mockModel = {
  predict: mockPredict,
};

const mockTf = {
  tensor: mock(() => ({})),
  tensor2d: mock(() => ({})),
  reshape: mock(() => ({})),
  sub: mock(() => ({})),
  div: mock(() => ({})),
  tidy: mock((fn) => fn()),
  getBackend: mock(() => 'cpu'),
  setBackend: mock(() => Promise.resolve()),
  ready: mock(() => Promise.resolve()),
  loadLayersModel: mock(() => Promise.resolve(mockModel)),
};

mock.module('@/lib/tensorflow', () => ({
  default: mockTf,
}));

mock.module('@/plugins/logger', () => ({
  logger: {
    info: mock(() => {}),
  },
}));

mock.module('@/env', () => ({
  env: {
    PREDICTION_MODEL_URL:
      Bun.env.PREDICTION_MODEL_URL || 'file://mock/model.json',
  },
}));

// 2. Import the service dynamically (must be after mocks)
// This ensures mocks are applied before the module is evaluated
const { PredictionService } = await import('./prediction.service');

describe('PredictionService', () => {
  let service: InstanceType<typeof PredictionService>;

  beforeEach(() => {
    // Reset mocks
    mockTf.loadLayersModel.mockClear();
    mockTf.setBackend.mockClear();
    mockTf.getBackend.mockImplementation(() => 'cpu'); // Default state
    mockPredict.mockClear();
    mockTf.tensor2d.mockClear();
    mockTf.reshape.mockClear();
    mockTf.sub.mockClear();
    mockTf.div.mockClear();
    mockTf.tensor.mockClear();

    // Create a fresh instance for each test
    service = new PredictionService();
  });

  it('should initialize correctly', () => {
    expect(service).toBeInstanceOf(PredictionService);
  });

  it('should load model and predict when model is not loaded', async () => {
    const inputData = new Array(14).fill(0.5);
    const result = await service.makePrediction(inputData);

    // Verify backend initialization
    expect(mockTf.setBackend).toHaveBeenCalledWith('wasm');
    expect(mockTf.ready).toHaveBeenCalled();

    // Verify model loading
    expect(mockTf.loadLayersModel).toHaveBeenCalledWith(
      Bun.env.PREDICTION_MODEL_URL || 'file://mock/model.json',
    );

    // Verify tensor initialization (mean and std)
    expect(mockTf.tensor).toHaveBeenCalledTimes(2);

    // Verify prediction
    expect(mockPredict).toHaveBeenCalled();
    expect(result).toBe(0.88);
  });

  it('should not reload model if already loaded', async () => {
    const inputData = new Array(14).fill(0.5);

    // First call loads the model
    await service.makePrediction(inputData);
    expect(mockTf.loadLayersModel).toHaveBeenCalledTimes(1);

    // Second call should reuse the model
    await service.makePrediction(inputData);
    expect(mockTf.loadLayersModel).toHaveBeenCalledTimes(1);
  });

  it('should not set backend if already wasm', async () => {
    mockTf.getBackend.mockImplementation(() => 'wasm');

    const inputData = new Array(14).fill(0.5);
    await service.makePrediction(inputData);

    expect(mockTf.setBackend).not.toHaveBeenCalled();
  });

  it('should normalize data using standardScaler logic', async () => {
    const inputData = new Array(14).fill(10);
    await service.makePrediction(inputData);

    // Verify tensor operations were called
    expect(mockTf.tensor2d).toHaveBeenCalled();
    expect(mockTf.reshape).toHaveBeenCalledTimes(2); // Mean and Std
    expect(mockTf.sub).toHaveBeenCalled();
    expect(mockTf.div).toHaveBeenCalled();
    expect(mockTf.tidy).toHaveBeenCalled();
  });

  it('should throw error if model loading fails', async () => {
    mockTf.loadLayersModel.mockRejectedValue(new Error('Model load failed'));

    const inputData = new Array(14).fill(0.5);
    await expect(service.makePrediction(inputData)).rejects.toThrow(
      'Model load failed',
    );
  });
});
