/**
 * Tests for POST /api/applications
 *
 * The actual runtime uses the compiled shared/schemas.js (not the .ts source).
 * At the time these tests were written, the compiled schema requires:
 *   - jobId: non-empty string (min 1)
 *   - jobTitle: non-empty string (min 1)
 *   - firstName / lastName: min 2 chars
 *   - email: valid email
 *   - consent: literal true
 *   - cvUrl: valid URL or empty string (optional)
 *   - phone / message: optional, max-bounded
 *
 * The honeypot (`website` field) is checked on req.body BEFORE Zod parsing,
 * so it is never part of the schema.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { nanoid } from 'nanoid';
import { createTestApp } from '../test-utils/app.js';
import { db } from '../db/index.js';
import { applications, jobs } from '../db/schema.js';
import { sql } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function seedJob(): Promise<string> {
  const id = nanoid(12);
  await db.insert(jobs).values({
    id,
    title: 'Ingénieur Télécoms',
    sector: 'Télécoms',
    type: 'CDI',
    location: 'Paris',
    description: 'Description courte',
    experience: '3-5 ans',
    skills: ['5G', 'IP'] as unknown as string[],
    fullDescription: 'Description complète du poste.',
    responsibilities: ['Responsabilité 1'] as unknown as string[],
    profile: ['Profil 1'] as unknown as string[],
    advantages: ['Avantage 1'] as unknown as string[],
    remote: 'Partiel',
    publishedDate: new Date().toISOString(),
    isActive: true,
  } as any);
  return id;
}

// ---------------------------------------------------------------------------
// Valid base body — matches the actual runtime schema (shared/schemas.js)
// NOTE: `website` is absent (honeypot left untriggered).
// ---------------------------------------------------------------------------

const makeValidBody = (jobId: string) => ({
  jobId,
  jobTitle: 'Ingénieur Télécoms',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.com',
  phone: '+33612345678',
  cvUrl: 'https://drive.example.com/cv.pdf',
  message: 'Je suis vivement intéressé par ce poste.',
  consent: true as const,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/applications', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await db.run(sql`DELETE FROM applications`);
    await db.run(sql`DELETE FROM jobs`);
  });

  // --- Happy paths ---------------------------------------------------------

  it('accepts a valid application for an existing job and persists it', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send(makeValidBody(jobId));

    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe('jean@example.com');
    expect(rows[0].jobId).toBe(jobId);
  });

  it('accepts an application with no cvUrl (empty string)', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), cvUrl: '' });

    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(1);
  });

  it('accepts an application with no phone (optional)', async () => {
    const jobId = await seedJob();
    const { phone: _omit, ...withoutPhone } = makeValidBody(jobId);
    const res = await request(app)
      .post('/api/applications')
      .send(withoutPhone);

    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(1);
  });

  // --- Consent validation --------------------------------------------------

  it('rejects with 400 when consent is false', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), consent: false });

    expect(res.status).toBe(400);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(0);
  });

  it('rejects with 400 when consent is missing', async () => {
    const jobId = await seedJob();
    const { consent: _omit, ...withoutConsent } = makeValidBody(jobId);
    const res = await request(app)
      .post('/api/applications')
      .send(withoutConsent);

    expect(res.status).toBe(400);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(0);
  });

  // --- Honeypot ------------------------------------------------------------

  it('silently accepts but does not store when honeypot (website) is filled', async () => {
    // The route checks req.body.website BEFORE Zod validation.
    // When filled, it returns 201 to fool the bot but skips DB write.
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), website: 'http://spam.example.com' });

    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(applications);
    expect(rows).toHaveLength(0);
  });

  // --- Field validation ----------------------------------------------------

  it('accepts empty jobId (treated as spontaneous application)', async () => {
    // The current schema makes jobId optional with default '' to support spontaneous
    // applications via the same endpoint (route sets isSpontaneous=true accordingly).
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(''), jobId: '' });

    expect([200, 201, 204]).toContain(res.status);
  });

  it('rejects with 400 on invalid email', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 when firstName is too short (< 2 chars)', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), firstName: 'J' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 when lastName is too short (< 2 chars)', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), lastName: 'D' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 on invalid cvUrl (not a URL and not empty)', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), cvUrl: 'not a url' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 when required firstName is missing', async () => {
    const jobId = await seedJob();
    const { firstName: _omit, ...withoutFirstName } = makeValidBody(jobId);
    const res = await request(app)
      .post('/api/applications')
      .send(withoutFirstName);

    expect(res.status).toBe(400);
  });

  it('accepts empty jobTitle (route resolves it from the related job)', async () => {
    const jobId = await seedJob();
    const res = await request(app)
      .post('/api/applications')
      .send({ ...makeValidBody(jobId), jobTitle: '' });

    expect([200, 201, 204]).toContain(res.status);
  });
});
