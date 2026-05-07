import { Router } from 'express';
import { db } from '../db/index.js';
import { jobs } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { createJobSchema, updateJobSchema } from '../../../shared/schemas.js';
import { nanoid } from 'nanoid';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// GET /api/admin/jobs — all jobs (including inactive)
router.get('/', async (_req, res) => {
  try {
    const result = await db.select().from(jobs);
    res.json(result);
  } catch (err) {
    console.error('Error fetching admin jobs:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// GET /api/admin/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    const job = result[0];
    if (!job) return res.status(404).json({ message: 'Offre non trouvee' });
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// POST /api/admin/jobs — create (admin + editor)
router.post('/', requireRole('admin', 'editor'), async (req, res) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const id = nanoid(12);
    const now = new Date().toISOString();
    const jobData = {
      id,
      ...parsed.data,
      publishedDate: parsed.data.publishedDate || now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    await db.insert(jobs).values(jobData as typeof jobs.$inferInsert);

    const result = await db.select().from(jobs).where(eq(jobs.id, id));
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// PUT /api/admin/jobs/:id — update (admin + editor)
router.put('/:id', requireRole('admin', 'editor'), async (req, res) => {
  try {
    const existing = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Offre non trouvee' });

    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    await db
      .update(jobs)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(jobs.id, req.params.id));

    const result = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    res.json(result[0]);
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// DELETE /api/admin/jobs/:id — soft delete (admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const existing = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Offre non trouvee' });

    await db
      .update(jobs)
      .set({ isActive: false, updatedAt: new Date().toISOString() })
      .where(eq(jobs.id, req.params.id));

    res.json({ message: 'Offre desactivee' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// PATCH /api/admin/jobs/:id/toggle — toggle (admin + editor)
router.patch('/:id/toggle', requireRole('admin', 'editor'), async (req, res) => {
  try {
    const existing = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Offre non trouvee' });

    await db
      .update(jobs)
      .set({ isActive: !existing[0].isActive, updatedAt: new Date().toISOString() })
      .where(eq(jobs.id, req.params.id));

    const result = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    res.json(result[0]);
  } catch (err) {
    console.error('Error toggling job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
