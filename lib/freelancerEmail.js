import { createSmtpTransport, getSmtpMailFrom, generateSmtpMessageId } from './smtp.js';

export { createSmtpTransport } from './smtp.js';

/**
 * Bazowy publiczny URL aplikacji (linki w mailach).
 * Ustaw NEXT_PUBLIC_APP_URL, np. https://strefastartu.pl
 */
export function getPublicAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

/** Link otwierany w przeglądarce — strona SSR (nie surowe `/api/…`), żeby Next nie ładował SPA na endpoincie API. */
export function getFreelancerActivationUrl(verificationToken) {
  return `${getPublicAppUrl()}/panel/freelancer/activate?token=${encodeURIComponent(verificationToken)}`;
}

/** @param {{ to: string; firstName?: string | null; verifyUrl: string }} opts */
export async function sendFreelancerVerificationEmail({ to, firstName, verifyUrl }) {
  const transport = createSmtpTransport();
  if (!transport) {
    const err = new Error('SMTP nie jest skonfigurowane (SMTP_HOST / SMTP_USER / SMTP_PASS)');
    err.code = 'SMTP_CONFIG';
    throw err;
  }

  const name = firstName?.trim() || 'Użytkowniku';
  const from = getSmtpMailFrom();
  const messageId = generateSmtpMessageId();

  await transport.sendMail({
    from,
    to,
    messageId,
    subject: 'Aktywuj konto w panelu freelancera — Strefa Startu',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <p>Witaj ${name},</p>
  <p>Dziękujemy za rejestrację. Aby odblokować pełny dostęp do panelu freelancera, kliknij poniższy link:</p>
  <p><a href="${verifyUrl}" style="display:inline-block;background:#c026d3;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Aktywuj konto</a></p>
  <p style="font-size:13px;color:#666;">Jeśli przycisk nie działa, skopiuj adres do przeglądarki:<br/><a href="${verifyUrl}">${verifyUrl}</a></p>
  <p style="font-size:13px;color:#666;">Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
</body>
</html>
    `.trim(),
    text: `Witaj ${name},\n\nAktywuj konto, otwierając adres w przeglądarce:\n${verifyUrl}\n`,
  });
}
