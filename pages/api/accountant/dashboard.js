import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    // Statystyki Ksiegowosci - dokumenty zaakceptowane przez koordynatora, oczekujace u ksiegowosci
    const pendingTransfers = await prisma.paymentRequest.count({
      where: { status: 'UNDER_REVIEW' }
    });

    const expressTransfers = await prisma.paymentRequest.count({
      where: { status: 'UNDER_REVIEW', amount: { gt: 5000 } } // Mock logic dla express: np wnioski pow 5000
    });

    const documentsToBook = await prisma.invoice.count({
      where: { status: 'VERIFIED' }
    });

    return res.status(200).json(apiResponse({
      expressTransfers,
      pendingTransfers,
      documentsToBook,
      transfersToVerify: pendingTransfers // Alias for dashboard compat
    }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['ACCOUNTANT', 'ADMIN']);
