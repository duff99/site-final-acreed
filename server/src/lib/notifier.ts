/**
 * Email notifier using SMTP via nodemailer (Microsoft 365 friendly).
 * Falls back to a no-op + console log when SMTP_HOST/USER/PASS is unset,
 * so the form submission flow never breaks even if mail is misconfigured.
 *
 * Default config targets Microsoft 365:
 *   SMTP_HOST=smtp.office365.com
 *   SMTP_PORT=587
 *   SMTP_USER=no-reply@acreedconsulting.com
 *   SMTP_PASS=<app-password>   # requires Authenticated SMTP enabled on the mailbox
 */

import nodemailer, { type Transporter } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'; // false → STARTTLS on 587
const NOTIFY_EMAIL_CONTACT = process.env.NOTIFY_EMAIL_CONTACT || 'contact@acreedconsulting.com';
const NOTIFY_EMAIL_RECRUITMENT =
  process.env.NOTIFY_EMAIL_RECRUITMENT || 'recrutement@acreedconsulting.com';
const NOTIFY_EMAIL_FROM =
  process.env.NOTIFY_EMAIL_FROM || SMTP_USER || 'no-reply@acreedconsulting.com';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    requireTLS: !SMTP_SECURE, // STARTTLS on 587
  });
  return transporter;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function send({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn('[notifier] SMTP_HOST/USER/PASS unset — skipping email:', subject);
    return;
  }

  try {
    await t.sendMail({
      from: NOTIFY_EMAIL_FROM,
      to,
      subject,
      html,
      replyTo,
    });
  } catch (err) {
    console.error('[notifier] sendMail failed:', err);
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
  isSpontaneous?: boolean;
}) {
  const firstName = payload.firstName ?? '';
  const lastName = payload.lastName ?? '';
  const email = payload.email ?? '';
  const isSpontaneous = payload.isSpontaneous || !payload.jobTitle;
  const jobTitle = isSpontaneous ? 'Candidature spontanée' : (payload.jobTitle ?? '');
  const html = `
    <h2>Nouvelle candidature${isSpontaneous ? ' spontanée' : ''}</h2>
    <p><strong>Candidat :</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)} &lt;${escapeHtml(email)}&gt;</p>
    ${payload.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</p>` : ''}
    ${!isSpontaneous ? `<p><strong>Offre :</strong> ${escapeHtml(jobTitle)}</p>` : ''}
    ${payload.cvUrl ? `<p><strong>CV :</strong> <a href="${escapeHtml(payload.cvUrl)}">${escapeHtml(payload.cvUrl)}</a></p>` : ''}
    ${payload.message ? `<hr/><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>` : ''}
    <hr/>
    <p style="color:#888;font-size:12px">Acreed Consulting — site.acreedconsulting.com</p>
  `;
  await send({
    to: NOTIFY_EMAIL_RECRUITMENT,
    subject: isSpontaneous ? '[Acreed] Candidature spontanée' : `[Acreed] Candidature — ${jobTitle}`,
    html,
    replyTo: email || undefined,
  });
}
