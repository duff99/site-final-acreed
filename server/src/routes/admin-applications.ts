import { Router } from 'express';
import { db } from '../db/index.js';
import { applications } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';
import { updateApplicationSchema } from '../../../shared/schemas.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// GET /api/admin/applications — list (admin + editor)
router.get('/', async (_req, res) => {
  try {
    const result = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));
    res.json(result);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// GET /api/admin/applications/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.id, req.params.id));
    const app = result[0];
    if (!app) return res.status(404).json({ message: 'Candidature non trouvee' });
    res.json(app);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// PATCH /api/admin/applications/:id — update status (admin + editor)
router.patch('/:id', requireRole('admin', 'editor'), async (req, res) => {
  try {
    const parsed = updateApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const existing = await db
      .select()
      .from(applications)
      .where(eq(applications.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Candidature non trouvee' });

    await db
      .update(applications)
      .set({ status: parsed.data.status })
      .where(eq(applications.id, req.params.id));

    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.id, req.params.id));
    res.json(result[0]);
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// DELETE /api/admin/applications/:id — admin only
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const existing = await db
      .select()
      .from(applications)
      .where(eq(applications.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Candidature non trouvee' });

    await db.delete(applications).where(eq(applications.id, req.params.id));
    res.json({ message: 'Candidature supprimee' });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
