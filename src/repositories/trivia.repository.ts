import { db } from '@/lib/db/client';
import { trivias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class TriviaRepository {
  private table: typeof trivias;
  constructor() {
    this.table = trivias;
  }

  public async getAll() {
    return await db.select().from(this.table);
  }
}

export const triviaRepository = new TriviaRepository();
