import { db } from '@/lib/db/client';
import seedActivities from './activities';
import seedHealthyFoods from './healthyFoods';
import seedTrivias from './trivias';
import { logger } from '@/plugins/logger';

async function main() {
  await Promise.all([seedHealthyFoods(), seedTrivias(), seedActivities()]);

  await db.$client.end();
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
}).finally(() => {
  logger.info('Seeding completed.');
  process.exit(0);
});
