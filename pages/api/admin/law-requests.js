import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const requests = await prisma.legalRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              companyName: true
            }
          }
        }
      });

      return res.status(200).json(apiResponse(requests));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body || {};
      const allowedStatuses = ['SUBMITTED', 'IN_REVIEW', 'CLOSED'];

      if (!id || !status || !allowedStatuses.includes(status)) {
        return res.status(400).json(apiResponse(null, 'Nieprawidłowe dane zmiany statusu.'));
      }

      const updated = await prisma.legalRequest.update({
        where: { id },
        data: { status }
      });

      return res.status(200).json(apiResponse(updated, null, 'Status został zaktualizowany.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['ADMIN']);
