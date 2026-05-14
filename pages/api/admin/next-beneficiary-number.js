import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

const LDAP_PREFIX = 'ldap_';
const START_NUMBER = 301002;

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const rows = await prisma.$queryRaw`
      SELECT MAX(beneficiaryNumber) AS maxBeneficiaryNumber
      FROM User
    `;
    const maxBeneficiaryNumber = Number(rows?.[0]?.maxBeneficiaryNumber || START_NUMBER - 1);
    const nextNumber = maxBeneficiaryNumber + 1;
    const nextBeneficiaryCode = `${LDAP_PREFIX}${nextNumber}`;

    return res.status(200).json(apiResponse({ nextBeneficiaryCode }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['ADMIN']);
