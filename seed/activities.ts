import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';

const seedActivities = async () => {
  const data = await Bun.file('./seed/data/activities.json').json();
  await db.insert(schema.activities).values(data);
};

export default seedActivities;
