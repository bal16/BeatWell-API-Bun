import type { updateUserDTO } from '@/features/users/schema';
import {
  userRepository,
  type UserRepository,
} from '@/repositories/user.repository';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = userRepository;
  }

  async updateUserById(id: string, inputs: updateUserDTO) {
    await this.repository.patchById(id, inputs);
  }

  async deleteUserById(id: string) {
    await this.repository.deleteById(id);
  }
}

export const userService = new UserService();
