import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        companyName: true,
        nextPaymentDate: true
      }
    });

    if (!user) {
      return res.status(404).json(apiResponse(null, 'User not found'));
    }

    let isBlockedForNonPayment = false;
    if (user.nextPaymentDate) {
      const today = new Date();
      const paymentDate = new Date(user.nextPaymentDate);
      const overdueMs = today.getTime() - paymentDate.getTime();
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
      if (overdueDays > 0) {
        isBlockedForNonPayment = true;
      }
    }

    return res.status(200).json(apiResponse({
      companyName: user.companyName || null,
      isBlockedForNonPayment
    }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER']);
