import { authService } from '../../services/auth.service';
import type { signInDTO } from './schema';

export const signIn = async ({ email, password }: signInDTO) => {
  return await authService.signIn(email, password);
};
