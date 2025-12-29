import * as z from 'zod';
import { env as bunenv } from 'bun';

/**
 * Environment variables schema validation using zod.
 *
 * This ensures that all required environment variables are present and correctly typed.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number<number>().default(3000),
  TRUSTED_ORIGINS: z
    .string()
    .default('')
    .transform((val) =>
      val.length !== 0
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : undefined,
    ),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  PREDICTION_MODEL_URL: z.url().min(1, 'PREDICTION_MODEL_URL is required'),
  CHATBOT_MODEL_URL: z.url().min(1, 'CHATBOT_MODEL_URL is required'),
  CHATBOT_INTENTS_URL: z.string().min(1, 'CHATBOT_INTENTS_URL is required'),
  CHATBOT_CLASSES_URL: z.string().min(1, 'CHATBOT_CLASSES_URL is required'),
  CHATBOT_WORDS_URL: z.string().min(1, 'CHATBOT_WORDS_URL is required'),
});

type Env = z.infer<typeof envSchema>;

const raw = {
  NODE_ENV: bunenv.NODE_ENV ?? process.env.NODE_ENV,
  PORT: bunenv.PORT ?? process.env.PORT,
  LOG_LEVEL: bunenv.LOG_LEVEL ?? process.env.LOG_LEVEL,
  DATABASE_URL: bunenv.DATABASE_URL ?? process.env.DATABASE_URL,

  TRUSTED_ORIGINS: bunenv.TRUSTED_ORIGINS ?? process.env.TRUSTED_ORIGINS,

  JWT_SECRET: bunenv.JWT_SECRET ?? process.env.JWT_SECRET,
  PREDICTION_MODEL_URL:
    bunenv.PREDICTION_MODEL_URL ?? process.env.PREDICTION_MODEL_URL,
  CHATBOT_MODEL_URL: bunenv.CHATBOT_MODEL_URL ?? process.env.CHATBOT_MODEL_URL,
  CHATBOT_INTENTS_URL:
    bunenv.CHATBOT_INTENTS_URL ?? process.env.CHATBOT_INTENTS_URL,
  CHATBOT_CLASSES_URL:
    bunenv.CHATBOT_CLASSES_URL ?? process.env.CHATBOT_CLASSES_URL,
  CHATBOT_WORDS_URL: bunenv.CHATBOT_WORDS_URL ?? process.env.CHATBOT_WORDS_URL,
};

const result = envSchema.safeParse(raw);

if (!result.success) {
  const msg = result.error.issues
    .map((err) => {
      const path = err.path.join('.');
      const val = path ? (raw as Record<string, unknown>)[path] : undefined;
      return `${path}: ${err.message}${val !== undefined ? ` (got: ${JSON.stringify(val)})` : ''}`;
    })
    .join('; ');
  throw new Error(`Invalid environment: ${msg}`);
}

export const env: Env = result.data;

export function envSummary() {
  return {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    LOG_LEVEL: env.LOG_LEVEL,
    TRUSTED_ORIGINS: env.TRUSTED_ORIGINS,
    PREDICTION_MODEL_URL: env.PREDICTION_MODEL_URL,
    CHATBOT_MODEL_URL: env.CHATBOT_MODEL_URL,
    CHATBOT_INTENTS_URL: env.CHATBOT_INTENTS_URL,
    CHATBOT_CLASSES_URL: env.CHATBOT_CLASSES_URL,
    CHATBOT_WORDS_URL: env.CHATBOT_WORDS_URL,
  };
}
