import { authService } from '@/services/auth.service';
import type { signUpDTO } from './schema';
import { logger } from '@/plugins/logger';

export const signUp = async ({ name, email, password }: signUpDTO) => {
  logger.debug(`Signing up user with email: ${email}`);
  return await authService.signUp(name, email, password);
};
