import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { jobs } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Validate optional sector query param to avoid arbitrary user input
// reaching the WHERE clause unfiltered.
const listQuerySchema = z.object({
  sector: z.string().max(50).optional(),
});

// GET /api/jobs — list all active jobs
router.get('/', async (req, res) => {
  try {
    const parsedQuery = listQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({ message: 'Parametres de requete invalides' });
    }
    const { sector } = parsedQuery.data;
    let result;

    if (sector && sector !== 'Tous') {
      result = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.isActive, true), eq(jobs.sector, sector)));
    } else {
      result = await db.select().from(jobs).where(eq(jobs.isActive, true));
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// GET /api/jobs/:id — single active job
router.get('/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, req.params.id), eq(jobs.isActive, true)));

    const job = result[0];
    if (!job) return res.status(404).json({ message: 'Offre non trouvee' });
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
