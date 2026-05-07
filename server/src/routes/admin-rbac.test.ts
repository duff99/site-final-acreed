import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { createTestApp } from '../test-utils/app.js';
import { db } from '../db/index.js';
import { admins, jobs, refreshTokens } from '../db/schema.js';
import { sql } from 'drizzle-orm';

const ADMIN_EMAIL = 'rbac-admin@example.com';
const EDITOR_EMAIL = 'rbac-editor@example.com';
const PASSWORD = 'TestPassword123!';

async function seedAdmins() {
  const hash = await bcrypt.hash(PASSWORD, 4);
  const now = new Date().toISOString();
  await db.insert(admins).values([
    {
      id: nanoid(12),
      email: ADMIN_EMAIL,
      name: 'Admin',
      passwordHash: hash,
      role: 'admin',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any,
    {
      id: nanoid(12),
      email: EDITOR_EMAIL,
      name: 'Editor',
      passwordHash: hash,
      role: 'editor',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any,
  ]);
}

async function clearAll() {
  await db.run(sql`DELETE FROM refresh_tokens`);
  await db.run(sql`DELETE FROM jobs`);
  await db.run(sql`DELETE FROM admins`);
}

async function loginAs(app: ReturnType<typeof createTestApp>, email: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD });
  expect(res.status).toBe(200);
  return res.body.accessToken;
}

/** Seed a fully valid job directly into the DB and return its id. */
async function seedJob(): Promise<string> {
  const id = nanoid(12);
  const now = new Date().toISOString();
  await db.insert(jobs).values({
    id,
    title: 'Test Job',
    sector: 'Telecoms',
    type: 'CDI',
    location: 'Paris',
    description: 'Short description',
    experience: '3-5 ans',
    skills: ['JavaScript', 'TypeScript'],
    fullDescription: 'Full description of the test job.',
    responsibilities: ['Write code', 'Review PRs'],
    profile: ['Experienced developer'],
    advantages: ['Remote friendly'],
    remote: 'Partiel',
    publishedDate: now.slice(0, 10),
    createdAt: now,
    updatedAt: now,
    isActive: true,
  } as any);
  return id;
}

/** A complete valid job payload that passes createJobSchema validation. */
const VALID_JOB_PAYLOAD = {
  title: 'Editor-created Job',
  sector: 'Telecoms',
  type: 'CDI',
  location: 'Paris',
  description: 'Short description',
  experience: '2-3 ans',
  skills: ['Node.js'],
  fullDescription: 'Full description here.',
  responsibilities: ['Build features'],
  profile: ['Team player'],
  advantages: ['Flexible hours'],
  remote: 'Total',
};

describe('RBAC — admin endpoints', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await clearAll();
    await seedAdmins();
  });

  // ── Unauthenticated access ────────────────────────────────────────────────

  it('returns 401 without auth on GET /api/admin/jobs', async () => {
    const res = await request(app).get('/api/admin/jobs');
    expect(res.status).toBe(401);
  });

  it('returns 401 without auth on GET /api/admin/users', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  // ── Admin has full access ─────────────────────────────────────────────────

  it('admin can list users (200)', async () => {
    const token = await loginAs(app, ADMIN_EMAIL);
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('admin can list jobs (200)', async () => {
    const token = await loginAs(app, ADMIN_EMAIL);
    const res = await request(app)
      .get('/api/admin/jobs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('admin CAN delete a job (200)', async () => {
    const token = await loginAs(app, ADMIN_EMAIL);
    const jobId = await seedJob();
    const res = await request(app)
      .delete(`/api/admin/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // ── Editor blocked from /api/admin/users ─────────────────────────────────

  it('editor receives 403 on GET /api/admin/users', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('editor receives 403 on POST /api/admin/users', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'new@example.com',
        password: 'NewPassword123!@',
        name: 'New User',
        role: 'editor',
      });
    expect(res.status).toBe(403);
  });

  it('editor receives 403 on PUT /api/admin/users/:id', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .put('/api/admin/users/some-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hacked' });
    expect(res.status).toBe(403);
  });

  it('editor receives 403 on DELETE /api/admin/users/:id', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .delete('/api/admin/users/some-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  // ── Editor blocked from DELETE jobs ──────────────────────────────────────

  it('editor receives 403 on DELETE /api/admin/jobs/:id', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const jobId = await seedJob();
    const res = await request(app)
      .delete(`/api/admin/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  // ── Editor CAN perform allowed job operations ─────────────────────────────

  it('editor CAN list jobs (200)', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .get('/api/admin/jobs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('editor CAN create a job (201)', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const res = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_JOB_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('editor CAN toggle a job (200)', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const jobId = await seedJob();
    const res = await request(app)
      .patch(`/api/admin/jobs/${jobId}/toggle`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('editor CAN update a job (200)', async () => {
    const token = await loginAs(app, EDITOR_EMAIL);
    const jobId = await seedJob();
    const res = await request(app)
      .put(`/api/admin/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
  });
});
