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
import authRouter from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';
import { requireRole } from './middleware/authorize.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rate limiting for auth login only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per window
  message: { message: 'Trop de tentatives, reessayez plus tard' },
});

// Public routes
app.use('/api/jobs', jobsRouter);

// Auth routes (rate limiter on login only)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRouter);

// Protected admin routes
app.use('/api/admin/jobs', requireAuth, adminJobsRouter);
app.use('/api/admin/users', requireAuth, requireRole('admin'), adminUsersRouter);

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
