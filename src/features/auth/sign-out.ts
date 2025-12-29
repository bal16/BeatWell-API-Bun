import { authService } from '@/services/auth.service';
import type { signOutDTO } from './schema';

export const signOut = async ({ token }: signOutDTO) => {
  return await authService.signOut(token);
};
