import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './app.js';

describe('Test harness smoke', () => {
  it('responds 200 on /api/health', async () => {
    const app = createTestApp();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
