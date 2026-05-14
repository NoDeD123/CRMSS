import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ownAffiliation: true }
    });

    if (!user) {
      return res.status(404).json(apiResponse(null, 'Użytkownik nie znaleziony'));
    }

    const affiliationCode = user.ownAffiliation || 'BRAK_KODU';

    const referredCount = await prisma.user.count({
      where: { affiliatedBy: affiliationCode }
    });

    return res.status(200).json(apiResponse({
      code: affiliationCode,
      count: referredCount
    }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER']);
