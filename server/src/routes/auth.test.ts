import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { createTestApp } from '../test-utils/app.js';
import { db } from '../db/index.js';
import { admins, refreshTokens } from '../db/schema.js';
import { sql } from 'drizzle-orm';

const TEST_EMAIL = 'auth-test@example.com';
const TEST_PASSWORD = 'TestPassword123!';

async function seedAdmin(role: 'admin' | 'editor' = 'admin') {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 4);
  const id = nanoid(12);
  await db.insert(admins).values({
    id,
    email: TEST_EMAIL,
    name: 'Test Admin',
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any);
  return id;
}

async function clearTables() {
  await db.run(sql`DELETE FROM refresh_tokens`);
  await db.run(sql`DELETE FROM admins`);
}

// ─── login ────────────────────────────────────────────────────────────────────

describe('Auth — login', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await clearTables();
  });

  it('returns access token and sets refresh cookie on valid credentials', async () => {
    await seedAdmin();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(typeof res.body.accessToken).toBe('string');
    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(res.body.user.role).toBe('admin');

    const cookies = res.headers['set-cookie'];
    const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : (cookies ?? '');
    expect(cookieStr).toMatch(/acreed_session=/);
  });

  it('returns 401 on wrong password', async () => {
    await seedAdmin();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: 'WrongPassword123!' });

    expect(res.status).toBe(401);
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: TEST_PASSWORD });

    expect(res.status).toBe(401);
  });

  it('returns 400 on missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

// ─── lockout ──────────────────────────────────────────────────────────────────

describe('Auth — lockout', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await clearTables();
    await seedAdmin();
  });

  it('locks account after 5 failed attempts and returns 423', async () => {
    // 5 wrong attempts — on the 5th attempt failedLoginAttempts reaches MAX_FAILED_ATTEMPTS
    // and lockedUntil is set; the 5th call still returns 401
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: 'WrongPassword!' });
    }
    // 6th attempt (even with correct password) must return 423 because account is locked
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(423);
  });

  it('returns 401 (not 423) on the 5th failed attempt itself', async () => {
    // The lock happens ON the 5th failed attempt but the response is still 401
    // (the route returns 401 after updating the lock, not 423 on the same request)
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: 'WrongPassword!' });
    }
    // 5th attempt — triggers the lock but still returns 401
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
  });
});

// ─── refresh rotation ─────────────────────────────────────────────────────────

describe('Auth — refresh rotation', () => {
  let app: ReturnType<typeof createTestApp>;

  async function loginAndGetCookie(): Promise<string> {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const setCookie = res.headers['set-cookie'];
    const cookieStr = (Array.isArray(setCookie) ? setCookie.join('; ') : setCookie) ?? '';
    const match = cookieStr.match(/acreed_session=([^;]+)/);
    return match ? match[1] : '';
  }

  beforeEach(async () => {
    app = createTestApp();
    await clearTables();
    await seedAdmin();
  });

  it('rotates refresh token on /refresh — returns new access token and new cookie', async () => {
    const oldCookie = await loginAndGetCookie();
    expect(oldCookie).toBeTruthy();

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${oldCookie}`);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(typeof refreshRes.body.accessToken).toBe('string');

    // A new cookie must be set
    const newSetCookie = refreshRes.headers['set-cookie'];
    const newCookieStr = (Array.isArray(newSetCookie) ? newSetCookie.join('; ') : newSetCookie) ?? '';
    const newMatch = newCookieStr.match(/acreed_session=([^;]+)/);
    const newCookie = newMatch ? newMatch[1] : '';

    expect(newCookie).toBeTruthy();
    expect(newCookie).not.toBe(oldCookie);
  });

  it('revokes old jti after rotation — old cookie cannot be used again', async () => {
    const oldCookie = await loginAndGetCookie();

    // First refresh — succeeds and rotates
    await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${oldCookie}`)
      .expect(200);

    // Old cookie must now be rejected
    const reusedRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${oldCookie}`);

    expect(reusedRes.status).toBe(401);
  });

  it('detects replay (reusing a revoked refresh) and revokes ALL tokens for that admin', async () => {
    const oldCookie = await loginAndGetCookie();

    // First refresh — succeeds, rotates the token
    await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${oldCookie}`)
      .expect(200);

    // Replay the original (now-revoked) cookie
    const replayRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${oldCookie}`);

    expect(replayRes.status).toBe(401);

    // After replay detection all refresh tokens in the DB must be revoked
    const allTokens = await db.select().from(refreshTokens);
    expect(allTokens.length).toBeGreaterThan(0);
    expect(allTokens.every(t => t.revokedAt !== null)).toBe(true);
  });

  it('returns 401 when no refresh cookie is present', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe('Auth — logout', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await clearTables();
    await seedAdmin();
  });

  it('returns 200 and clears the refresh cookie', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieStr = (Array.isArray(setCookie) ? setCookie.join('; ') : setCookie) ?? '';
    const match = cookieStr.match(/acreed_session=([^;]+)/);
    const cookie = match ? match[1] : '';
    expect(cookie).toBeTruthy();

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', `acreed_session=${cookie}`);

    expect(logoutRes.status).toBe(200);
  });

  it('revokes the jti so the old cookie fails /refresh after logout', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieStr = (Array.isArray(setCookie) ? setCookie.join('; ') : setCookie) ?? '';
    const match = cookieStr.match(/acreed_session=([^;]+)/);
    const cookie = match ? match[1] : '';

    await request(app)
      .post('/api/auth/logout')
      .set('Cookie', `acreed_session=${cookie}`)
      .expect(200);

    // Attempting to refresh with the now-revoked cookie must fail
    const afterLogout = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${cookie}`);

    expect(afterLogout.status).toBe(401);
  });

  it('returns 200 even when called without a cookie (idempotent)', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
  });
});

// ─── change-password ──────────────────────────────────────────────────────────

describe('Auth — change-password', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    app = createTestApp();
    await clearTables();
    await seedAdmin();
  });

  it('revokes all active refresh tokens and returns 200 after password change', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const accessToken = loginRes.body.accessToken as string;
    const setCookie = loginRes.headers['set-cookie'];
    const cookieStr = (Array.isArray(setCookie) ? setCookie.join('; ') : setCookie) ?? '';
    const cookieMatch = cookieStr.match(/acreed_session=([^;]+)/);
    const cookie = cookieMatch ? cookieMatch[1] : '';
    expect(accessToken).toBeTruthy();
    expect(cookie).toBeTruthy();

    const newPassword = 'NewStrongPassword123!@';
    const cpRes = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: TEST_PASSWORD, newPassword, confirmPassword: newPassword });

    expect([200, 204]).toContain(cpRes.status);

    // The old refresh cookie must now fail
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `acreed_session=${cookie}`);

    expect(refreshRes.status).toBe(401);
  });

  it('returns 401 when currentPassword is wrong', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const accessToken = loginRes.body.accessToken as string;

    const wrongNewPw = 'NewPassword123!@';
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'WrongCurrentPassword!', newPassword: wrongNewPw, confirmPassword: wrongNewPw });

    expect(res.status).toBe(401);
  });

  it('returns 401 when called without a valid access token', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .send({ currentPassword: TEST_PASSWORD, newPassword: 'NewPassword123!@' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when payload is invalid (missing newPassword and confirmPassword)', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const accessToken = loginRes.body.accessToken as string;

    // Send only currentPassword — schema requires newPassword + confirmPassword
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: TEST_PASSWORD });

    expect(res.status).toBe(400);
  });
});
