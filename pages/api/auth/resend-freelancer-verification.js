import crypto from 'crypto';
import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';
import { withAuth } from '../../../lib/withAuth';
import {
  createSmtpTransport,
  sendFreelancerVerificationEmail,
  getFreelancerActivationUrl,
} from '../../../lib/freelancerEmail.js';

/** ms; w dev domyślnie 1 s (testy). Produkcja: 120 s. Nadpisz: FREELANCER_RESEND_COOLDOWN_MS */
const RESEND_COOLDOWN_MS = (() => {
  const fromEnv = Number(process.env.FREELANCER_RESEND_COOLDOWN_MS);
  if (Number.isFinite(fromEnv) && fromEnv >= 0) return fromEnv;
  return process.env.NODE_ENV === 'production' ? 120_000 : 1_000;
})();

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    if (!createSmtpTransport()) {
      return res.status(503).json(
        apiResponse(null, 'Wysyłka e-maili nie jest skonfigurowana. Skontaktuj się z administratorem.')
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        emailVerifiedAt: true,
        emailVerificationSentAt: true,
      },
    });

    if (!user || user.role !== 'FREELANCER') {
      return res.status(404).json(apiResponse(null, 'Nie znaleziono konta'));
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json(apiResponse(null, 'Konto jest już aktywne.'));
    }

    if (user.emailVerificationSentAt) {
      const elapsed = Date.now() - new Date(user.emailVerificationSentAt).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json(
          apiResponse(null, `Poczekaj ${waitSec} s przed kolejną wysyłką.`)
        );
      }
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationSentAt: new Date(),
      },
    });

    const verifyUrl = getFreelancerActivationUrl(verificationToken);

    await sendFreelancerVerificationEmail({
      to: user.email,
      firstName: user.firstName,
      verifyUrl,
    });

    return res.status(200).json(apiResponse({ ok: true }, null, 'Wysłano ponownie wiadomość aktywacyjną.'));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['FREELANCER']);
