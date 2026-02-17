import { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import type { AdminRole } from '../../../shared/types.js';

export function requireRole(...roles: AdminRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Non authentifie' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Permission insuffisante' });
    }

    next();
  };
}
