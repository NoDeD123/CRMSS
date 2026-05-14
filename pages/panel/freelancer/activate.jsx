import { verifyFreelancerEmailTokenAndSignJwt, serializeFreelancerSessionCookie } from '../../../lib/freelancerEmailVerification';

/**
 * Aktywacja konta z linku w mailu — **strona** zamiast samego `/api/...`,
 * żeby uniknąć konfliktów routera Next (hard navigate / manifest 404 przy wejściu na API z UI).
 */
export async function getServerSideProps(context) {
  const raw = context.query.token;
  const token = Array.isArray(raw) ? raw[0] : raw;

  const result = await verifyFreelancerEmailTokenAndSignJwt(token);

  if (!result.ok) {
    const q =
      result.reason === 'missing'
        ? 'verify=missing'
        : result.reason === 'invalid'
          ? 'verify=invalid'
          : 'verify=error';
    return {
      redirect: {
        destination: `/panel/freelancer/login?${q}`,
        permanent: false,
      },
    };
  }

  context.res.setHeader('Set-Cookie', serializeFreelancerSessionCookie(result.jwt));

  return {
    redirect: {
      destination: '/panel/freelancer/dashboard?verified=1',
      permanent: false,
    },
  };
}

export default function FreelancerActivatePage() {
  return null;
}
