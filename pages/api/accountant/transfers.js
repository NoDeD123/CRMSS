import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pendingTransfers = await prisma.paymentRequest.findMany({
        where: {
          OR: [
            { status: 'UNDER_REVIEW' },
            { status: 'PAID' }
          ]
        },
        include: {
          user: {
            select: { firstName: true, lastName: true, ownAffiliation: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      return res.status(200).json(apiResponse(pendingTransfers));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, action } = req.body;

      if (!id || action !== 'PAID') {
        return res.status(400).json(apiResponse(null, 'Brakuje ID lub nieprawidłowa akcja'));
      }

      const updateResult = await prisma.paymentRequest.updateMany({
        where: { id, status: 'UNDER_REVIEW' },
        data: { status: 'PAID' }
      });

      if (updateResult.count === 0) {
        return res.status(404).json(apiResponse(null, 'Nie znaleziono wniosku lub ma on nieprawidłowy status'));
      }

      return res.status(200).json(apiResponse({ updatedId: id, status: 'PAID' }, null, 'Wniosek został oznaczony jako opłacony'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['ACCOUNTANT', 'ADMIN']);
