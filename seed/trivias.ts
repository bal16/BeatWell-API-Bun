import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';

const seedTrivias = async () => {
  const data = await Bun.file('./seed/data/trivias.json').json();
  await db.insert(schema.trivias).values(data);
};

export default seedTrivias;
