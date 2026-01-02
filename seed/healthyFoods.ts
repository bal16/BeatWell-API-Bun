import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';

const seedHealthyFoods = async () => {
  const data = await Bun.file('./seed/data/healthyFoods.json').json();
  await db.insert(schema.healthyFoods).values(data);
};

export default seedHealthyFoods;
