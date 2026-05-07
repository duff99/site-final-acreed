import { db } from '../db/index.js';
import { contactMessages, applications } from '../db/schema.js';
import { lt } from 'drizzle-orm';

const THREE_YEARS_MS = 3 * 365 * 24 * 60 * 60 * 1000;
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

export async function purgeExpiredData(): Promise<{ messages: number; applications: number }> {
  const now = Date.now();
  // createdAt is stored as ISO 8601 text — ISO strings sort lexicographically,
  // so a simple string comparison with lt() is correct.
  const messagesCutoff = new Date(now - THREE_YEARS_MS).toISOString();
  const applicationsCutoff = new Date(now - TWO_YEARS_MS).toISOString();

  const deletedMessages = await db
    .delete(contactMessages)
    .where(lt(contactMessages.createdAt, messagesCutoff))
    .returning({ id: contactMessages.id });

  const deletedApplications = await db
    .delete(applications)
    .where(lt(applications.createdAt, applicationsCutoff))
    .returning({ id: applications.id });

  console.log(
    `[retention] Purged ${deletedMessages.length} messages (>3y) and ${deletedApplications.length} applications (>24mo)`
  );

  return {
    messages: deletedMessages.length,
    applications: deletedApplications.length,
  };
}
