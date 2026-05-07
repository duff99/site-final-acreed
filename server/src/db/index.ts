import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';
import { config } from '../config.js';
import fs from 'fs';
import path from 'path';

// Ensure data directory exists
const dbDir = path.dirname(config.DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: `file:${config.DATABASE_PATH}`,
});

export const db = drizzle(client, { schema });

// Create tables if they don't exist
await db.run(sql`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sector TEXT NOT NULL,
    experience TEXT NOT NULL,
    skills TEXT NOT NULL,
    full_description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    profile TEXT NOT NULL,
    advantages TEXT NOT NULL,
    remote TEXT NOT NULL,
    published_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  )
`);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )
`);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    is_spontaneous INTEGER NOT NULL DEFAULT 0,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    cv_url TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  )
`);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    jti TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL
  )
`);

await db.run(sql`
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_admin_id ON refresh_tokens (admin_id)
`);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login_at TEXT,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT '',
    created_by TEXT
  )
`);

// Migrate existing admins table: add new columns if missing
const migrations = [
  `ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'editor'`,
  `ALTER TABLE admins ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`,
  `ALTER TABLE admins ADD COLUMN last_login_at TEXT`,
  `ALTER TABLE admins ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE admins ADD COLUMN created_by TEXT`,
  `ALTER TABLE admins ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE admins ADD COLUMN locked_until TEXT`,
  // applications table: add is_spontaneous column for spontaneous applications
  `ALTER TABLE applications ADD COLUMN is_spontaneous INTEGER NOT NULL DEFAULT 0`,
];

for (const migration of migrations) {
  try {
    await db.run(sql.raw(migration));
  } catch (e: any) {
    // Ignore "duplicate column" errors (column already exists)
    if (!e.message?.includes('duplicate column')) {
      // Also ignore if table was freshly created with the columns
      if (!e.message?.includes('already exists')) {
        console.warn('Migration warning:', e.message);
      }
    }
  }
}

// Ensure at least one admin has the 'admin' role
const { rows: adminRoleCheck } = await client.execute(
  "SELECT COUNT(*) as cnt FROM admins WHERE role = 'admin'"
);
if (adminRoleCheck[0] && Number(adminRoleCheck[0].cnt) === 0) {
  await client.execute(
    "UPDATE admins SET role = 'admin' WHERE rowid = (SELECT MIN(rowid) FROM admins)"
  );
}
