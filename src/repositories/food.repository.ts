import { db } from '../lib/db/client';
import { healthyFoods } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

export class FoodRepository {
  private table: typeof healthyFoods;
  constructor() {
    this.table = healthyFoods;
  }

  public async getRandom(limit: number) {
    return await db
      .select()
      .from(this.table)
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }
}

export const foodRepository = new FoodRepository();
