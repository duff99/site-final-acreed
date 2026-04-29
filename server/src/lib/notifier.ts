/**
 * Email notifier using Resend HTTP API (no SDK dependency).
 * Falls back to a no-op + console log when RESEND_API_KEY is unset,
 * so the form submission flow never breaks even if mail is misconfigured.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL_CONTACT = process.env.NOTIFY_EMAIL_CONTACT || 'contact@acreedconsulting.com';
const NOTIFY_EMAIL_RECRUITMENT = process.env.NOTIFY_EMAIL_RECRUITMENT || 'recrutement@acreedconsulting.com';
const NOTIFY_EMAIL_FROM = process.env.NOTIFY_EMAIL_FROM || 'no-reply@acreedconsulting.com';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function send({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[notifier] RESEND_API_KEY unset — skipping email:', subject);
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: NOTIFY_EMAIL_FROM,
        to,
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[notifier] Resend error', res.status, body);
    }
  } catch (err) {
    console.error('[notifier] send failed:', err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function notifyContact(payload: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}) {
  const safeName = payload.name ?? '';
  const safeEmail = payload.email ?? '';
  const safeSubject = payload.subject ?? '';
  const safeMessage = payload.message ?? '';
  const html = `
    <h2>Nouveau message de contact</h2>
    <p><strong>De :</strong> ${escapeHtml(safeName)} &lt;${escapeHtml(safeEmail)}&gt;</p>
    ${payload.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</p>` : ''}
    <p><strong>Sujet :</strong> ${escapeHtml(safeSubject)}</p>
    <hr/>
    <p style="white-space:pre-wrap">${escapeHtml(safeMessage)}</p>
    <hr/>
    <p style="color:#888;font-size:12px">Acreed Consulting — site.acreedconsulting.com</p>
  `;
  // Spontaneous applications submitted via the contact form go to recruitment;
  // everything else (Recrutement / Consulting / Partenariat / Autre) goes to contact.
  const to =
    safeSubject === 'Candidature spontanée' ? NOTIFY_EMAIL_RECRUITMENT : NOTIFY_EMAIL_CONTACT;

  await send({
    to,
    subject: `[Acreed] Contact — ${safeSubject}`,
    html,
    replyTo: safeEmail || undefined,
  });
}

export async function notifyApplication(payload: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  message?: string;
  cvUrl?: string;
}) {
  const firstName = payload.firstName ?? '';
  const lastName = payload.lastName ?? '';
  const email = payload.email ?? '';
  const jobTitle = payload.jobTitle ?? '';
  const html = `
    <h2>Nouvelle candidature</h2>
    <p><strong>Candidat :</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)} &lt;${escapeHtml(email)}&gt;</p>
    ${payload.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</p>` : ''}
    <p><strong>Offre :</strong> ${escapeHtml(jobTitle)}</p>
    ${payload.cvUrl ? `<p><strong>CV :</strong> <a href="${escapeHtml(payload.cvUrl)}">${escapeHtml(payload.cvUrl)}</a></p>` : ''}
    ${payload.message ? `<hr/><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>` : ''}
    <hr/>
    <p style="color:#888;font-size:12px">Acreed Consulting — site.acreedconsulting.com</p>
  `;
  await send({
    to: NOTIFY_EMAIL_RECRUITMENT,
    subject: `[Acreed] Candidature — ${jobTitle}`,
    html,
    replyTo: email || undefined,
  });
}
