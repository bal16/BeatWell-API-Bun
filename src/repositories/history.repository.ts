import { db } from '@/lib/db/client';
import { histories } from '@/lib/db/schema';

export class HistoryRepository {
  private table: typeof histories;
  constructor() {
    this.table = histories;
  }
  public async findAll() {
    return await db.select().from(this.table);
  }

  public async save({ userId, result }: { userId: string; result: string }) {
    await db.insert(this.table).values({
      userId,
      result,
    });
  }
}

export const historyRepository = new HistoryRepository();
