import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { user } from './auth-schema';

export const activities = pgTable('activities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  image: text('image').notNull(),
  detail: text('detail').notNull(),
});

export const histories = pgTable(
  'histories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    result: text('result').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('histories_user_id_index').on(table.userId)],
);

export const trivias = pgTable('trivias', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  trivia: text('trivia').notNull(),
});

export const healthProfiles = pgTable(
  'health_profiles',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('health_profiles_user_id_index').on(table.userId)],
);

export const healthyFoods = pgTable('healthy_foods', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  recipe: text('recipe').notNull(),
  image: text('image').notNull(),
  ingredient: text('ingredient').notNull(),
});

export const healthProfilesRelations = relations(healthProfiles, ({ one }) => ({
  user: one(user, {
    fields: [healthProfiles.userId],
    references: [user.id],
  }),
}));

export const historiesRelations = relations(histories, ({ one }) => ({
  user: one(user, {
    fields: [histories.userId],
    references: [user.id],
  }),
}));
