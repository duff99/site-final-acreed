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

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').default(''),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  cvFilename: text('cv_filename'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull(),
  jobTitle: text('job_title').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').default(''),
  cvUrl: text('cv_url').default(''),
  message: text('message').default(''),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
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
