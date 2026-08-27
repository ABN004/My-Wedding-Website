import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const wishes = pgTable('wishes', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	relation: text('relation').notNull(),
	message: text('message'),
	imageUrl: text('image_url').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
