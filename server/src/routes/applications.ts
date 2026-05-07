import { Router } from 'express';
import { db } from '../db/index.js';
import { applications } from '../db/schema.js';
import { createApplicationSchema } from '../../../shared/schemas.js';
import { nanoid } from 'nanoid';
import { notifyApplication } from '../lib/notifier.js';

const router = Router();

// POST /api/applications — public job application submission
router.post('/', async (req, res) => {
  try {
    // Honeypot: see contact.ts. Hidden `website` field must stay empty.
    if (typeof req.body?.website === 'string' && req.body.website.trim() !== '') {
      return res.status(201).json({ message: 'Candidature envoyee avec succes', id: 'hp' });
    }

    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const id = nanoid(12);
    const now = new Date().toISOString();
    const isSpontaneous = !parsed.data.jobId || parsed.data.isSpontaneous === true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(applications).values({
      id,
      jobId: parsed.data.jobId || '',
      jobTitle: isSpontaneous ? 'Candidature spontanée' : (parsed.data.jobTitle || ''),
      isSpontaneous: isSpontaneous ? 1 : 0,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone || '',
      cvUrl: parsed.data.cvUrl || '',
      message: parsed.data.message || '',
      createdAt: now,
    } as any);

    notifyApplication({ ...parsed.data, isSpontaneous }).catch((err) =>
      console.error('[applications] notifier failed:', err)
    );

    res.status(201).json({ message: 'Candidature envoyee avec succes', id });
  } catch (err) {
    console.error('Error saving application:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
