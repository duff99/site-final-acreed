import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { db } from '../db/index.js';
import { admins, refreshTokens } from '../db/schema.js';
import { and, eq, isNull } from 'drizzle-orm';
import { config } from '../config.js';
import { loginSchema, changePasswordSchema } from '../../../shared/schemas.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Refresh token cookie + lifetime constants.
const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Account lockout policy.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: REFRESH_TTL_SECONDS * 1000,
};

async function issueRefreshToken(adminId: string) {
  const jti = nanoid(32);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000).toISOString();

  await db.insert(refreshTokens).values({
    jti,
    adminId,
    expiresAt,
    revokedAt: null,
  });

  const token = jwt.sign(
    { sub: adminId, type: 'refresh', jti },
    config.JWT_SECRET,
    { expiresIn: REFRESH_TTL_SECONDS }
  );

  return token;
}

function signAccessToken(admin: { id: string; email: string; role: string }) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_TTL }
  );
}

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

    if (admin.lockedUntil && new Date(admin.lockedUntil).getTime() > Date.now()) {
      return res
        .status(423)
        .json({ message: 'Compte temporairement verrouille, reessayez plus tard' });
    }

    const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!valid) {
      const nextAttempts = (admin.failedLoginAttempts ?? 0) + 1;
      const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;
      await db
        .update(admins)
        .set({
          failedLoginAttempts: shouldLock ? 0 : nextAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString()
            : admin.lockedUntil ?? null,
        })
        .where(eq(admins.id, admin.id));
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const accessToken = signAccessToken(admin);
    const refreshToken = await issueRefreshToken(admin.id);

    await db.update(admins)
      .set({
        lastLoginAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      })
      .where(eq(admins.id, admin.id));

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    res.json({
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// POST /api/auth/refresh — rotation: revoke the presented jti, issue a new one.
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Aucun refresh token' });

    let payload: { sub: string; type?: string; jti?: string };
    try {
      payload = jwt.verify(token, config.JWT_SECRET) as typeof payload;
    } catch {
      return res.status(401).json({ message: 'Token invalide' });
    }

    if (payload.type !== 'refresh' || !payload.jti) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Look up the token in the DB. It must exist, not be revoked, not be
    // expired. If we can't find it OR it's revoked, treat the cookie as
    // compromised: revoke every refresh token for that admin (forces re-login
    // everywhere). Belt-and-suspenders against token replay.
    const found = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.jti, payload.jti));
    const stored = found[0];

    if (!stored || stored.revokedAt) {
      if (payload.sub) {
        await db
          .update(refreshTokens)
          .set({ revokedAt: new Date().toISOString() })
          .where(
            and(eq(refreshTokens.adminId, payload.sub), isNull(refreshTokens.revokedAt))
          );
      }
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: 'Token invalide' });
    }

    if (new Date(stored.expiresAt).getTime() < Date.now()) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: 'Token expire' });
    }

    const adminRows = await db.select().from(admins).where(eq(admins.id, payload.sub));
    const admin = adminRows[0];
    if (!admin) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    if (!admin.isActive) {
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date().toISOString() })
        .where(eq(refreshTokens.jti, payload.jti));
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(403).json({ message: 'Compte desactive' });
    }

    // Rotation: revoke old, mint new.
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(eq(refreshTokens.jti, payload.jti));

    const newRefresh = await issueRefreshToken(admin.id);
    const accessToken = signAccessToken(admin);

    res.cookie(REFRESH_COOKIE_NAME, newRefresh, refreshCookieOptions);
    res.json({
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(401).json({ message: 'Token invalide' });
  }
});

// POST /api/auth/logout — revoke the presented refresh token.
router.post('/logout', async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as { jti?: string; type?: string };
      if (payload.type === 'refresh' && payload.jti) {
        await db
          .update(refreshTokens)
          .set({ revokedAt: new Date().toISOString() })
          .where(eq(refreshTokens.jti, payload.jti));
      }
    } catch {
      // Already invalid — nothing to revoke, just clear the cookie.
    }
  }
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
  res.json({ message: 'Deconnecte' });
});

// POST /api/auth/change-password — current user changes their own password.
// Requires the current password as proof of session integrity, hashes the new
// one with bcrypt, and revokes every other refresh token belonging to this
// account so concurrent sessions on other devices are kicked out.
router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const adminRows = await db.select().from(admins).where(eq(admins.id, req.admin!.id));
    const admin = adminRows[0];
    if (!admin) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    const newHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await db
      .update(admins)
      .set({
        passwordHash: newHash,
        updatedAt: new Date().toISOString(),
        // Reset lockout state — successful password change is a clean slate.
        failedLoginAttempts: 0,
        lockedUntil: null,
      })
      .where(eq(admins.id, admin.id));

    // Revoke ALL still-active refresh tokens for this admin, including the
    // one tied to the current session. The cookie carrying the now-revoked
    // jti is also cleared so the next /refresh on this browser fails clean
    // and the user is redirected to /admin/login.
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(
        and(eq(refreshTokens.adminId, admin.id), isNull(refreshTokens.revokedAt))
      );

    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    res.json({ message: 'Mot de passe mis a jour. Reconnectez-vous.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
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
