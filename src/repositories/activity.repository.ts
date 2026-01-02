import { db } from '../lib/db/client';
import { activities } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

export class ActivityRepository {
  private table: typeof activities;
  constructor() {
    this.table = activities;
  }

  public async getRandom(limit: number) {
    return await db
      .select()
      .from(this.table)
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }
}

export const activityRepository = new ActivityRepository();
