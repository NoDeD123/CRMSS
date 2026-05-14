import { serialize } from 'cookie';
import { prisma } from './prisma';
import { signToken } from './auth';

const SESSION_COOKIE = 'token';

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  };
}

/** Nagłówek Set-Cookie dla JWT sesji panelu. */
export function serializeFreelancerSessionCookie(jwt) {
  return serialize(SESSION_COOKIE, jwt, sessionCookieOptions());
}

/**
 * Weryfikuje token z maila, zapisuje emailVerifiedAt, zwraca JWT do ciasteczka.
 * @param {unknown} rawToken
 * @returns {Promise<{ ok: true, jwt: string } | { ok: false, reason: 'missing' | 'invalid' | 'error' }>}
 */
export async function verifyFreelancerEmailTokenAndSignJwt(rawToken) {
  const token = typeof rawToken === 'string' ? rawToken.trim() : '';
  if (!token) {
    return { ok: false, reason: 'missing' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        role: 'FREELANCER',
      },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return { ok: false, reason: 'invalid' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      },
    });

    const jwt = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { ok: true, jwt };
  } catch (e) {
    console.error('verifyFreelancerEmailTokenAndSignJwt', e);
    return { ok: false, reason: 'error' };
  }
}
