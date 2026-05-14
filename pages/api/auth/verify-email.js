import { verifyFreelancerEmailTokenAndSignJwt, serializeFreelancerSessionCookie } from '../../../lib/freelancerEmailVerification';

/** @deprecated dla nowych maili używaj `/panel/freelancer/activate` — kompatybilność ze starymi linkami. */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const raw = req.query.token;
  const token = typeof raw === 'string' ? raw.trim() : '';

  const result = await verifyFreelancerEmailTokenAndSignJwt(token);

  if (!result.ok) {
    const dest =
      result.reason === 'missing'
        ? '/panel/freelancer/login?verify=missing'
        : result.reason === 'invalid'
          ? '/panel/freelancer/login?verify=invalid'
          : '/panel/freelancer/login?verify=error';
    return res.redirect(302, dest);
  }

  res.setHeader('Set-Cookie', serializeFreelancerSessionCookie(result.jwt));
  return res.redirect(302, '/panel/freelancer/dashboard?verified=1');
}
