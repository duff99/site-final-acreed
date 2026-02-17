import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  location: text('location').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  sector: text('sector').notNull(),
  experience: text('experience').notNull(),
  skills: text('skills', { mode: 'json' }).notNull().$type<string[]>(),
  fullDescription: text('full_description').notNull(),
  responsibilities: text('responsibilities', { mode: 'json' }).notNull().$type<string[]>(),
  profile: text('profile', { mode: 'json' }).notNull().$type<string[]>(),
  advantages: text('advantages', { mode: 'json' }).notNull().$type<string[]>(),
  remote: text('remote').notNull(),
  publishedDate: text('published_date').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('editor'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  createdBy: text('created_by'),
});
