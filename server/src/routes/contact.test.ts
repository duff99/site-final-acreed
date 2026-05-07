import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../test-utils/app.js';
import { db } from '../db/index.js';
import { contactMessages } from '../db/schema.js';
import { sql } from 'drizzle-orm';

const validBody = {
  name: 'Jean Dupont',
  email: 'jean@example.com',
  phone: '+33612345678',
  subject: 'Recrutement' as const,
  message: 'Bonjour, je suis intéressé par vos services.',
  consent: true as const,
  // Note: `website` is NOT part of createContactSchema — it is read directly
  // from req.body before Zod parsing (honeypot pattern in contact.ts).
};

describe('POST /api/contact', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await db.run(sql`DELETE FROM contact_messages`);
  });

  it('accepts a valid submission and persists it', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send(validBody);

    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(contactMessages);
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(validBody.email);
    expect(rows[0].name).toBe(validBody.name);
    expect(rows[0].subject).toBe(validBody.subject);
  });

  it('rejects with 400 if consent is false', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, consent: false });

    expect(res.status).toBe(400);

    const rows = await db.select().from(contactMessages);
    expect(rows).toHaveLength(0);
  });

  it('rejects with 400 if consent is missing', async () => {
    const { consent: _omit, ...withoutConsent } = validBody;
    const res = await request(app)
      .post('/api/contact')
      .send(withoutConsent);

    expect(res.status).toBe(400);

    const rows = await db.select().from(contactMessages);
    expect(rows).toHaveLength(0);
  });

  it('silently accepts but does not store when honeypot (website) is filled', async () => {
    // The route checks req.body.website before Zod validation and returns 201
    // without writing to DB, to avoid revealing the trap to bots.
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, website: 'http://spam.example.com' });

    // Implementation returns 201 to fool the bot
    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(contactMessages);
    expect(rows).toHaveLength(0);
  });

  it('silently accepts but does not store when honeypot has whitespace-only value', async () => {
    // Whitespace-only is treated as empty (trim()), so it is NOT a bot signal.
    // A real bot would fill with a real URL, so this should pass through normally.
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, website: '   ' });

    // Whitespace only → honeypot NOT triggered → normal validation → persisted
    expect([200, 201, 204]).toContain(res.status);

    const rows = await db.select().from(contactMessages);
    expect(rows).toHaveLength(1);
  });

  it('rejects with 400 on invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 on missing required name field', async () => {
    const { name: _omit, ...withoutName } = validBody;
    const res = await request(app)
      .post('/api/contact')
      .send(withoutName);

    expect(res.status).toBe(400);
  });

  it('rejects with 400 on missing required message field', async () => {
    const { message: _omit, ...withoutMessage } = validBody;
    const res = await request(app)
      .post('/api/contact')
      .send(withoutMessage);

    expect(res.status).toBe(400);
  });

  it('rejects with 400 on invalid subject (not in enum)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, subject: 'InvalidSubject' });

    expect(res.status).toBe(400);
  });

  it('rejects with 400 when message is too short (< 10 chars)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validBody, message: 'Court' });

    expect(res.status).toBe(400);
  });

  it('accepts all valid subject enum values', async () => {
    const subjects = [
      'Recrutement',
      'Consulting',
      'Partenariat',
      'Candidature spontanée',
      'Autre',
    ] as const;

    for (const subject of subjects) {
      await db.run(sql`DELETE FROM contact_messages`);
      const res = await request(app)
        .post('/api/contact')
        .send({ ...validBody, subject });

      expect([200, 201, 204]).toContain(res.status);
      const rows = await db.select().from(contactMessages);
      expect(rows).toHaveLength(1);
    }
  });
});
