import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    // Statystyki Koordynatora - wyliczanie za pomoca Prisma agregatów
    const totalBeneficiaries = await prisma.user.count({
      where: { role: 'USER' }
    });

    const pendingInvoices = await prisma.invoice.count({
      where: { status: 'PENDING' }
    });

    const pendingPayouts = await prisma.paymentRequest.count({
      where: { status: 'SUBMITTED' } // Submitted = oczekujace na decyzje
    });

    const totalDocumentsPending = pendingInvoices + pendingPayouts;

    return res.status(200).json(apiResponse({
      totalBeneficiaries,
      totalDocumentsPending
    }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['COORDINATOR', 'ADMIN']);
