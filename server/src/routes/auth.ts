import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { admins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { config } from '../config.js';
import { loginSchema } from '../../../shared/schemas.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.email, parsed.data.email));
    const admin = result[0];
    if (!admin) return res.status(401).json({ message: 'Identifiants incorrects' });

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Compte desactive' });
    }

    const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects' });

    const accessToken = jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_ACCESS_TTL }
    );
    const refreshToken = jwt.sign(
      { sub: admin.id, type: 'refresh' },
      config.JWT_SECRET,
      { expiresIn: config.JWT_REFRESH_TTL }
    );

    // Update lastLoginAt
    await db.update(admins)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(admins.id, admin.id));

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'Aucun refresh token' });

    const payload = jwt.verify(token, config.JWT_SECRET) as { sub: string };
    const result = await db.select().from(admins).where(eq(admins.id, payload.sub));
    const admin = result[0];
    if (!admin) return res.status(401).json({ message: 'Utilisateur introuvable' });

    if (!admin.isActive) {
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Compte desactive' });
    }

    const accessToken = jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_ACCESS_TTL }
    );

    res.json({
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Deconnecte' });
});

// GET /api/auth/me — current user profile
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await db.select({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      role: admins.role,
      isActive: admins.isActive,
      createdAt: admins.createdAt,
      updatedAt: admins.updatedAt,
      lastLoginAt: admins.lastLoginAt,
      createdBy: admins.createdBy,
    }).from(admins).where(eq(admins.id, req.admin!.id));
    const admin = result[0];
    if (!admin) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(admin);
  } catch {
    res.status(500).json({ message: 'Erreur interne' });
  }
});

export default router;
