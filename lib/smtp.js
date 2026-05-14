import nodemailer from 'nodemailer';
import crypto from 'crypto';

const DEFAULT_NO_REPLY = 'no-reply@strefastartu.pl';

/** Domena w nagłówku Message-ID (bez @). Nie używaj „localhost” — filtry często wtedy odrzucają wiadomość. */
export function getSmtpMessageIdDomain() {
  const explicit = process.env.SMTP_MESSAGE_ID_DOMAIN?.trim();
  if (explicit) return explicit.replace(/^@/, '');
  const user = process.env.SMTP_USER;
  if (user?.includes('@')) return user.split('@')[1].trim();
  return 'strefastartu.pl';
}

export function generateSmtpMessageId() {
  const domain = getSmtpMessageIdDomain();
  const id = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  return `<${id}@${domain}>`;
}

/** Hostname w EHLO/HELO — FQDN serwera SMTP. */
function smtpClientName() {
  return (
    process.env.SMTP_EHLO_NAME?.trim() ||
    process.env.SMTP_HOST?.trim() ||
    'mail.strefastartu.pl'
  );
}

/** RFC 5322: „Name" <addr> — nie „Name (addr)". */
function normalizeSmtpFromOverride(raw) {
  const s = raw.trim();
  const m = s.match(/^(.+?)\s*\(\s*([^<>\s()]+\s*@[^<>\s()]+\s*)\s*\)\s*$/);
  if (m) {
    const name = m[1].trim().replace(/^["']|["']$/g, '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${name}" <${m[2].replace(/\s/g, '')}>`;
  }
  return s;
}

/** Powiadomienia wewnętrzne ze zgłoszeń (np. ankieta „Dołącz do nas”). */
export const DEFAULT_FORM_NOTIFY_TO =
  process.env.SMTP_NOTIFY_TO || 'zgloszenia@strefastartu.pl';

export function createSmtpTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 465);
  const tlsRejectUnauthorized =
    process.env.SMTP_TLS_REJECT_UNAUTHORIZED === '0' ||
    process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false';
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    name: smtpClientName(),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    ...(tlsRejectUnauthorized ? { tls: { rejectUnauthorized: false } } : {}),
  });
}

/**
 * Widoczny nadawca. Uwierzytelnianie SMTP nadal przez SMTP_USER / SMTP_PASS.
 * Jeśli ustawiono SMTP_FROM — używane jest w całości (jedna zmienna na cały serwis).
 */
export function getSmtpMailFrom(displayName = 'Strefa Startu') {
  const override = process.env.SMTP_FROM?.trim();
  if (override) return normalizeSmtpFromOverride(override);
  const escaped = displayName.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}" <${DEFAULT_NO_REPLY}>`;
}
