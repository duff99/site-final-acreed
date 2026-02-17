import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import type { AdminRole } from '../../../shared/types.js';

export interface AuthRequest extends Request {
  admin?: { id: string; email: string; role: AdminRole };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requis' });
  }

  try {
    const payload = jwt.verify(header.slice(7), config.JWT_SECRET) as {
      sub: string;
      email: string;
      role?: AdminRole;
    };
    req.admin = { id: payload.sub, email: payload.email, role: payload.role || 'editor' };
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expire' });
  }
}
