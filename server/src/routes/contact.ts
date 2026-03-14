import { Router } from 'express';
import { db } from '../db/index.js';
import { contactMessages } from '../db/schema.js';
import { createContactSchema } from '../../../shared/schemas.js';
import { nanoid } from 'nanoid';

const router = Router();

// POST /api/contact — public contact form submission
router.post('/', async (req, res) => {
  try {
    const parsed = createContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const id = nanoid(12);
    const now = new Date().toISOString();

    await db.insert(contactMessages).values({
      id,
      ...parsed.data,
      createdAt: now,
    });

    res.status(201).json({ message: 'Message envoye avec succes', id });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
