import { userService } from '@/services/user.service';

export const deleteCurrentUser = async (currentUserId: string) => {
  // call userservice updateCurrentUser
  await userService.deleteUserById(currentUserId);
};
