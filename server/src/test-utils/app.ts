/**
 * Test app factory — composes a fresh Express app without calling app.listen().
 * Rate limiters are intentionally omitted so tests are not throttled.
 * Route files are imported from their original locations; they share the `db`
 * singleton from db/index.ts, which uses ':memory:' because setup.ts sets
 * DATABASE_PATH=':memory:' before any module is imported.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from '../routes/auth.js';
import jobsRouter from '../routes/jobs.js';
import adminJobsRouter from '../routes/admin-jobs.js';
import adminUsersRouter from '../routes/admin-users.js';
import adminContactRouter from '../routes/admin-contact.js';
import adminApplicationsRouter from '../routes/admin-applications.js';
import contactRouter from '../routes/contact.js';
import applicationsRouter from '../routes/applications.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';

export function createTestApp() {
  const app = express();

  // Middleware (no trust proxy needed in tests; no rate limiters)
  app.use(helmet());
  app.use(cors({ origin: 'http://localhost:8081', credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Public routes
  app.use('/api/jobs', jobsRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/applications', applicationsRouter);

  // Auth routes (no rate limiter in tests)
  app.use('/api/auth', authRouter);

  // Protected admin routes
  app.use('/api/admin/jobs', requireAuth, requireRole('admin', 'editor'), adminJobsRouter);
  app.use('/api/admin/users', requireAuth, requireRole('admin'), adminUsersRouter);
  app.use('/api/admin/contact-messages', requireAuth, requireRole('admin', 'editor'), adminContactRouter);
  app.use('/api/admin/applications', requireAuth, requireRole('admin', 'editor'), adminApplicationsRouter);

  // Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // Global error handler
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  );

  return app;
}
