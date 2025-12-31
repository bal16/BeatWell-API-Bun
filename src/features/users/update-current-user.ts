import { userService } from '@/services/user.service';
import type { updateUserDTO } from './schema';

export const updateCurrentUser = async (
  currentUserId: string,
  inputs: updateUserDTO,
) => {
  // call userservice updateCurrentUser
  await userService.updateUserById(currentUserId, inputs);
};
