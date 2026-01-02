import { db } from '../lib/db/client';
import { histories } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

export class HistoryRepository {
  private table: typeof histories;
  constructor() {
    this.table = histories;
  }

  public async findByUserId(userId: string) {
    return await db
      .select()
      .from(this.table)
      .where(eq(this.table.userId, userId));
  }

  public async findById(id: string) {
    return (await db.select().from(this.table).where(eq(this.table.id, id)))[0];
  }

  public async delete(id: string) {
    return await db.delete(this.table).where(eq(this.table.id, id));
  }

  public async save({ userId, result }: { userId: string; result: string }) {
    await db.insert(this.table).values({
      userId,
      result,
    });
  }
}

export const historyRepository = new HistoryRepository();
