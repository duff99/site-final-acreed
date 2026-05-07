import { Router } from 'express';
import { db } from '../db/index.js';
import { contactMessages } from '../db/schema.js';
import { createContactSchema } from '../../../shared/schemas.js';
import { nanoid } from 'nanoid';
import { notifyContact } from '../lib/notifier.js';

const router = Router();

// POST /api/contact — public contact form submission
router.post('/', async (req, res) => {
  try {
    // Honeypot: legit form leaves the hidden `website` field empty. Bots that
    // auto-fill every input populate it. Return success to avoid telling the
    // bot the trap exists, but skip the DB write and the email notification.
    if (typeof req.body?.website === 'string' && req.body.website.trim() !== '') {
      return res.status(201).json({ message: 'Message envoye avec succes', id: 'hp' });
    }

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
    } as typeof contactMessages.$inferInsert);

    // Fire-and-forget — never block response on email delivery
    notifyContact(parsed.data).catch((err) =>
      console.error('[contact] notifier failed:', err)
    );

    res.status(201).json({ message: 'Message envoye avec succes', id });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
