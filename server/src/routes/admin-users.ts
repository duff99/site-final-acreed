import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { admins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createAdminSchema, updateAdminSchema } from '../../../shared/schemas.js';
import type { AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// Defense-in-depth: every route under /api/admin/users requires admin role.
// The mount point in index.ts already enforces this, but a router-level guard
// makes the constraint explicit and survives any future re-mounting.
router.use(requireRole('admin'));

const adminFields = {
  id: admins.id,
  email: admins.email,
  name: admins.name,
  role: admins.role,
  isActive: admins.isActive,
  createdAt: admins.createdAt,
  updatedAt: admins.updatedAt,
  lastLoginAt: admins.lastLoginAt,
  createdBy: admins.createdBy,
};

// GET /api/admin/users — List all admins
router.get('/', async (_req, res) => {
  try {
    const result = await db.select(adminFields).from(admins);
    res.json(result);
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// GET /api/admin/users/:id — Get single admin
router.get('/:id', async (req, res) => {
  try {
    const result = await db.select(adminFields).from(admins).where(eq(admins.id, req.params.id));
    const admin = result[0];
    if (!admin) return res.status(404).json({ message: 'Utilisateur non trouve' });
    res.json(admin);
  } catch (err) {
    console.error('Error fetching admin user:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// POST /api/admin/users — Create admin
router.post('/', async (req: AuthRequest, res) => {
  try {
    const parsed = createAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Donnees invalides',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // Check email uniqueness
    const existing = await db.select().from(admins).where(eq(admins.email, parsed.data.email));
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est deja utilise' });
    }

    const hash = await bcrypt.hash(parsed.data.password, 12);
    const now = new Date().toISOString();
    const id = nanoid();

    await db.insert(admins).values({
      id,
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: hash,
      role: parsed.data.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: req.admin?.id || null,
    });

    const result = await db.select(adminFields).from(admins).where(eq(admins.id, id));
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// PUT /api/admin/users/:id — Update admin
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const existing = await db.select().from(admins).where(eq(admins.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Utilisateur non trouve' });

    const parsed = updateAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Donnees invalides',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // Prevent removing the last admin role
    if (parsed.data.role && parsed.data.role !== 'admin' && existing[0].role === 'admin') {
      const adminRoleUsers = await db.select().from(admins).where(eq(admins.role, 'admin'));
      const activeAdmins = adminRoleUsers.filter(a => a.isActive);
      if (activeAdmins.length <= 1) {
        return res.status(400).json({ message: 'Impossible de retirer le dernier administrateur' });
      }
    }

    // Prevent self-deactivation
    if (parsed.data.isActive === false && req.params.id === req.admin?.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas desactiver votre propre compte' });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (parsed.data.email) updateData.email = parsed.data.email;
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.role) updateData.role = parsed.data.role;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;
    if (parsed.data.password) {
      updateData.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    }

    await db.update(admins).set(updateData).where(eq(admins.id, req.params.id));

    const result = await db.select(adminFields).from(admins).where(eq(admins.id, req.params.id));
    res.json(result[0]);
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

// DELETE /api/admin/users/:id — Soft delete (deactivate)
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const existing = await db.select().from(admins).where(eq(admins.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Utilisateur non trouve' });

    // Prevent self-deletion
    if (req.params.id === req.admin?.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // Prevent deleting the last admin
    if (existing[0].role === 'admin') {
      const adminRoleUsers = await db.select().from(admins).where(eq(admins.role, 'admin'));
      const activeAdmins = adminRoleUsers.filter(a => a.isActive);
      if (activeAdmins.length <= 1) {
        return res.status(400).json({ message: 'Impossible de supprimer le dernier administrateur' });
      }
    }

    await db.update(admins)
      .set({ isActive: false, updatedAt: new Date().toISOString() })
      .where(eq(admins.id, req.params.id));

    res.json({ message: 'Utilisateur desactive' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

export default router;
