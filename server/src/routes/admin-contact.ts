import { Router } from 'express';
import { db } from '../db/index.js';
import { contactMessages } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';
import { updateContactMessageSchema } from '../../../shared/schemas.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// GET /api/admin/contact-messages — list (admin + editor)
router.get('/', async (_req, res) => {
  try {
    const result = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    res.json(result);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// GET /api/admin/contact-messages/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, req.params.id));
    const msg = result[0];
    if (!msg) return res.status(404).json({ message: 'Message non trouve' });
    res.json(msg);
  } catch (err) {
    console.error('Error fetching contact message:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// PATCH /api/admin/contact-messages/:id — toggle isRead (admin + editor)
router.patch('/:id', requireRole('admin', 'editor'), async (req, res) => {
  try {
    const parsed = updateContactMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: 'Donnees invalides', errors: parsed.error.flatten().fieldErrors });
    }

    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Message non trouve' });

    await db
      .update(contactMessages)
      .set({ isRead: parsed.data.isRead })
      .where(eq(contactMessages.id, req.params.id));

    const result = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, req.params.id));
    res.json(result[0]);
  } catch (err) {
    console.error('Error updating contact message:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// DELETE /api/admin/contact-messages/:id — admin only
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, req.params.id));
    if (!existing[0]) return res.status(404).json({ message: 'Message non trouve' });

    await db.delete(contactMessages).where(eq(contactMessages.id, req.params.id));
    res.json({ message: 'Message supprime' });
  } catch (err) {
    console.error('Error deleting contact message:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

export default router;
