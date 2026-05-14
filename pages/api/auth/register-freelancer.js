import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';
import { signToken } from '../../../lib/auth';
import {
  sendFreelancerVerificationEmail,
  createSmtpTransport,
  getFreelancerActivationUrl,
} from '../../../lib/freelancerEmail.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { serialize } from 'cookie';

const MIN_PASSWORD_LENGTH = 8;

function normalizePhone(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.replace(/\s/g, '').replace(/-/g, '');
  if (s.startsWith('+48')) s = s.slice(3);
  if (s.startsWith('48') && s.length > 9) s = s.slice(2);
  return s.length ? s : null;
}

function isValidPlPhone(digits) {
  if (!digits || typeof digits !== 'string') return false;
  if (!/^\d+$/.test(digits)) return false;
  return digits.length >= 9 && digits.length <= 11;
}

function normalizePesel(raw) {
  if (typeof raw !== 'string') return null;
  const digits = raw.replace(/\D/g, '');
  return digits.length === 11 ? digits : null;
}

function isValidPeselChecksum(pesel) {
  if (!pesel || pesel.length !== 11) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i], 10) * weights[i];
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(pesel[10], 10);
}

function generateAffiliationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function uniqueAffiliationCode() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateAffiliationCode();
    const exists = await prisma.user.findFirst({
      where: { ownAffiliation: code },
      select: { id: true },
    });
    if (!exists) return code;
  }
  return null;
}

function mustConsent(value) {
  return value === true || value === 'true';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const rawEmail = req.body?.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    const password = req.body?.password;
    const firstName = typeof req.body?.firstName === 'string' ? req.body.firstName.trim() : '';
    const lastName = typeof req.body?.lastName === 'string' ? req.body.lastName.trim() : '';
    const phoneNorm = normalizePhone(req.body?.phone ?? '');
    const peselNorm = normalizePesel(req.body?.pesel ?? '');

    const acceptRegulamin = mustConsent(req.body?.acceptRegulamin);
    const acceptRodo = mustConsent(req.body?.acceptRodo);
    const acceptPrivacy = mustConsent(req.body?.acceptPrivacy);
    const acceptCookies = mustConsent(req.body?.acceptCookies);

    if (!acceptRegulamin || !acceptRodo || !acceptPrivacy || !acceptCookies) {
      return res.status(400).json(
        apiResponse(null, 'Aby założyć konto, musisz zaakceptować Regulamin, Politykę RODO, Politykę prywatności oraz Politykę cookies.')
      );
    }

    if (!email || !password) {
      return res.status(400).json(apiResponse(null, 'Adres e-mail i hasło są wymagane'));
    }

    if (!firstName || !lastName) {
      return res.status(400).json(apiResponse(null, 'Imię i nazwisko są wymagane'));
    }

    if (!phoneNorm || !isValidPlPhone(phoneNorm)) {
      return res.status(400).json(apiResponse(null, 'Podaj poprawny numer telefonu (min. 9 cyfr).'));
    }

    if (!peselNorm || !isValidPeselChecksum(peselNorm)) {
      return res.status(400).json(apiResponse(null, 'Podaj poprawny numer PESEL (11 cyfr, suma kontrolna).'));
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json(apiResponse(null, `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków`));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json(apiResponse(null, 'Konto o tym adresie e-mail już istnieje.'));
    }

    const existingPesel = await prisma.user.findUnique({
      where: { pesel: peselNorm },
      select: { id: true },
    });
    if (existingPesel) {
      return res.status(409).json(apiResponse(null, 'Konto z tym numerem PESEL już istnieje.'));
    }

    const ownAffiliation = await uniqueAffiliationCode();
    if (!ownAffiliation) {
      return res.status(500).json(apiResponse(null, 'Nie udało się utworzyć konta. Spróbuj ponownie.'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const transport = createSmtpTransport();
    const devEmailBypass =
      process.env.FREELANCER_DEV_SKIP_EMAIL_VERIFICATION === 'true' ||
      process.env.FREELANCER_DEV_SKIP_EMAIL_VERIFICATION === '1';
    const skipEmailVerifyInDev =
      !transport && process.env.NODE_ENV !== 'production' && devEmailBypass;

    if (!transport && process.env.NODE_ENV === 'production') {
      return res.status(503).json(
        apiResponse(null, 'Rejestracja jest chwilowo niedostępna — brak konfiguracji wysyłki e-mail (SMTP). Skontaktuj się z administratorem.')
      );
    }

    if (!transport && process.env.NODE_ENV !== 'production' && !devEmailBypass) {
      return res.status(503).json(
        apiResponse(
          null,
          'Brak konfiguracji SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS). Dodaj je do .env, aby wysłać mail aktywacyjny. ' +
            'Tylko na lokalny test bez poczty możesz ustawić FREELANCER_DEV_SKIP_EMAIL_VERIFICATION=true.'
        )
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phoneNorm,
        pesel: peselNorm,
        role: 'FREELANCER',
        ownAffiliation,
        nextPaymentDate: null,
        legalConsentsAt: new Date(),
        emailVerifiedAt: skipEmailVerifyInDev ? new Date() : null,
        emailVerificationToken: skipEmailVerifyInDev ? null : verificationToken,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        emailVerifiedAt: true,
      },
    });

    if (!skipEmailVerifyInDev) {
      try {
        const verifyUrl = getFreelancerActivationUrl(verificationToken);
        await sendFreelancerVerificationEmail({
          to: email,
          firstName,
          verifyUrl,
        });
        await prisma.user.update({
          where: { id: newUser.id },
          data: { emailVerificationSentAt: new Date() },
        });
      } catch (mailErr) {
        console.error('register-freelancer: e-mail aktywacyjny', mailErr);
        await prisma.user.delete({ where: { id: newUser.id } });
        return res.status(500).json(
          apiResponse(null, 'Konto nie zostało utworzone — nie udało się wysłać wiadomości aktywacyjnej. Spróbuj ponownie później.')
        );
      }
    } else {
      console.warn(
        'register-freelancer: FREELANCER_DEV_SKIP_EMAIL_VERIFICATION — pominięto mail, ustawiono emailVerifiedAt (tylko dev)'
      );
    }

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    }));

    return res.status(201).json(
      apiResponse(
        {
          user: newUser,
          needsEmailVerification: !newUser.emailVerifiedAt,
          devAutoVerified: skipEmailVerifyInDev,
        },
        null,
        'Konto freelancera zostało utworzone.'
      )
    );
  } catch (error) {
    return errorHandler(error, res);
  }
}
