import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import jobsRouter from './routes/jobs.js';
import adminJobsRouter from './routes/admin-jobs.js';
import adminUsersRouter from './routes/admin-users.js';
import adminContactRouter from './routes/admin-contact.js';
import adminApplicationsRouter from './routes/admin-applications.js';
import authRouter from './routes/auth.js';
import contactRouter from './routes/contact.js';
import applicationsRouter from './routes/applications.js';
import { requireAuth } from './middleware/auth.js';
import { requireRole } from './middleware/authorize.js';
import { purgeExpiredData } from './lib/data-retention.js';

// Block startup if JWT secret is unchanged in production
if (process.env.NODE_ENV === 'production' && config.JWT_SECRET === 'CHANGE-ME-IN-PRODUCTION') {
  throw new Error('CRITICAL: JWT_SECRET must be changed in production. Set a strong random secret via environment variable.');
}

const app = express();

// Trust reverse proxy (nginx) for correct IP detection
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Global API rate limiting (60 requests per minute per IP)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Trop de requetes, reessayez plus tard' },
});
app.use('/api/', apiLimiter);

// Strict rate limiting for auth endpoints (10 requests per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, reessayez plus tard' },
});

// Contact form rate limiting (5 submissions per 15 min per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de messages envoyes, reessayez plus tard' },
});

// Public routes
app.use('/api/jobs', jobsRouter);
app.use('/api/contact', contactLimiter, contactRouter);
app.use('/api/applications', contactLimiter, applicationsRouter);

// Auth routes (strict rate limiter on login + refresh)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/refresh', authLimiter);
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

app.listen(config.PORT, () => {
  console.log(`API running on http://localhost:${config.PORT}`);
});

// GDPR data retention: run once at startup, then every 24h
purgeExpiredData().catch((err) => console.error('[retention] startup purge failed:', err));
setInterval(
  () => purgeExpiredData().catch((err) => console.error('[retention] interval purge failed:', err)),
  24 * 60 * 60 * 1000
);
