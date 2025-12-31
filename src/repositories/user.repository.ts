import type { updateUserDTO } from '@/features/users/schema';
import { db } from '@/lib/db/client';
import { trivias, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class UserRepository {
  private table: typeof user;
  constructor() {
    this.table = user;
  }

  public async patchById(id: string, inputs: updateUserDTO) {
    await db.update(this.table).set(inputs).where(eq(this.table.id, id));
  }

  public async deleteById(id: string) {
    await db.delete(this.table).where(eq(this.table.id, id));
  }
}

export const userRepository = new UserRepository();
