import * as z from 'zod';

export const sexMap = {
  male: 1,
  female: 0,
};

const formatSex = (data: string) =>
  sexMap[data.toLowerCase() as 'male' | 'female'];

export const predictionBodySchema = z.object({
  sex: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(
      z.enum(['male', 'female'], {
        error: 'Sex must be either "male" or "female"',
      }),
    )
    .transform((val) => formatSex(val))
    .describe('Biological sex of the individual, either "male" or "female"'),
  age: z.number().describe('Age of the individual in years'),
  cigsPerday: z.number().describe('Number of cigarettes smoked per day'),
  BPMeds: z
    .boolean()
    .transform((val) => (val ? 1 : 0))
    .describe('Whether the individual is on blood pressure medication'),
  prevalentStroke: z
    .boolean()
    .transform((val) => (val ? 1 : 0))
    .describe('Whether the individual has had a stroke'),
  prevalentHyp: z
    .boolean()
    .transform((val) => (val ? 1 : 0))
    .describe('Whether the individual has hypertension'),
  diabetes: z
    .boolean()
    .transform((val) => (val ? 1 : 0))
    .describe('Whether the individual has diabetes'),
  totChol: z.number().describe('Total cholesterol level'),
  sysBP: z.number().describe('Systolic blood pressure'),
  diaBP: z.number().describe('Diastolic blood pressure'),
  height: z.number().describe('Height of the individual in centimeters'),
  weight: z.number().describe('Weight of the individual in kilograms'),
  heartRate: z
    .number()
    .describe('Heart rate of the individual in beats per minute'),
  glucose: z.number().describe('Glucose level of the individual'),
});

export type predictionDTO = z.infer<typeof predictionBodySchema>;
