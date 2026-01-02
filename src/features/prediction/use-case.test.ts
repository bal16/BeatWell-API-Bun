// make the unit test here similar to the chatbot one
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { predictionDTO } from './schema';

// Mock dependencies
const mockMakePrediction = mock();
const mockRecordHistory = mock();
const mockLoggerDebug = mock();

mock.module('@/services/prediction.service', () => ({
  predictionService: {
    makePrediction: mockMakePrediction,
  },
}));

mock.module('@/services/history.service', () => ({
  historyService: {
    record: mockRecordHistory,
  },
}));

mock.module('@/plugins/logger', () => ({
  logger: {
    debug: mockLoggerDebug,
  },
}));

// Import the function under test
const { predictCHD } = await import('./predict-chd');

describe('predictCHD', () => {
  beforeEach(() => {
    mockMakePrediction.mockReset();
    mockRecordHistory.mockReset();
    mockLoggerDebug.mockReset();
  });

  const userId = 'user-123';
  // Mock DTO matching the shape expected by predictCHD (after Zod transformation)
  const dto = {
    sex: 1, // male
    age: 50,
    cigsPerday: 10,
    BPMeds: 0,
    prevalentStroke: 0,
    prevalentHyp: 1,
    diabetes: 0,
    totChol: 200,
    sysBP: 120,
    diaBP: 80,
    height: 180, // cm
    weight: 80, // kg
    heartRate: 75,
    glucose: 90,
  } as predictionDTO;

  it('should calculate risk, record history, and return result', async () => {
    // Calculate expected derived values based on implementation
    const expectedBMI = dto.weight / dto.height ** 2;
    const expectedIsSmoker = 1; // cigsPerday > 0

    const expectedInputData = [
      dto.sex,
      dto.age,
      expectedIsSmoker,
      dto.cigsPerday,
      dto.BPMeds,
      dto.prevalentStroke,
      dto.prevalentHyp,
      dto.diabetes,
      dto.totChol,
      dto.sysBP,
      dto.diaBP,
      expectedBMI,
      dto.heartRate,
      dto.glucose,
    ];

    const rawPrediction = 0.456; // 45.6%
    const expectedRisk = 46; // Math.round(0.456 * 100)

    mockMakePrediction.mockResolvedValue(rawPrediction);
    mockRecordHistory.mockResolvedValue(undefined);

    const result = await predictCHD(dto, userId);

    expect(mockMakePrediction).toHaveBeenCalledWith(expectedInputData);
    expect(mockRecordHistory).toHaveBeenCalledWith(userId, expectedRisk);
    expect(result).toBe(expectedRisk);
    expect(mockLoggerDebug).toHaveBeenCalledWith({ result: expectedRisk });
  });

  it('should handle non-smoker correctly', async () => {
    const nonSmokerDto = { ...dto, cigsPerday: 0 };
    const expectedBMI = nonSmokerDto.weight / nonSmokerDto.height ** 2;
    const expectedIsSmoker = 0;

    mockMakePrediction.mockResolvedValue(0.1);

    await predictCHD(nonSmokerDto, userId);

    // Check the 3rd argument (index 2) of the call to makePrediction
    const callArgs = mockMakePrediction.mock.calls[0][0];
    expect(callArgs[2]).toBe(expectedIsSmoker);
    expect(callArgs[11]).toBe(expectedBMI);
  });

  it('should propagate errors from prediction service', async () => {
    const error = new Error('Prediction failed');
    mockMakePrediction.mockRejectedValue(error);

    await expect(predictCHD(dto, userId)).rejects.toThrow('Prediction failed');
    expect(mockRecordHistory).not.toHaveBeenCalled();
  });

  it('should propagate errors from history service', async () => {
    mockMakePrediction.mockResolvedValue(0.5);
    const error = new Error('Database error');
    mockRecordHistory.mockRejectedValue(error);

    await expect(predictCHD(dto, userId)).rejects.toThrow('Database error');
  });
});
