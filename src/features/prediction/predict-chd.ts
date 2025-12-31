import { predictionService } from '@/services/prediction.service';
import type { predictionDTO } from './schema';
import { historyRepository } from '@/repositories/history.repository';
import { logger } from '@/plugins/logger';

const bmiCalculator = (height: number, weight: number) => {
  return weight / height ** 2;
};

const formatInput = (
  inputs: predictionDTO & { BMI: number; isSmoker: number },
): number[] => [
  inputs.sex,
  inputs.age,
  inputs.isSmoker,
  inputs.cigsPerday,
  inputs.BPMeds,
  inputs.prevalentStroke,
  inputs.prevalentHyp,
  inputs.diabetes,
  inputs.totChol,
  inputs.sysBP,
  inputs.diaBP,
  inputs.BMI,
  inputs.heartRate,
  inputs.glucose,
];

export const predictCHD = async (dto: predictionDTO, userId: string) => {
  // Calculate BMI
  logger.debug("HELLOWWWWWW");
  const BMI = bmiCalculator(dto.height, dto.weight);
  const isSmokerAsNumber = dto.cigsPerday > 0 ? 1 : 0;

  // transform input data to an array of numbers
  const inputData = formatInput({ ...dto, BMI, isSmoker: isSmokerAsNumber });

  // execute prediction
  const result = await predictionService
    .makePrediction(inputData)
    // transform to percentage
    .then((r) => Math.round(r * 100));

  logger.debug({ result });
  // save to history
  await historyRepository.save({ userId, result: `${result}%` });

  // return the result
  return result;
};
