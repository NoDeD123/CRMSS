import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const [totalUsers, newUsers24h, usersWithActiveSubscription, pendingPaymentRequests] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: oneDayAgo }
        }
      }),
      prisma.user.count({
        where: {
          nextPaymentDate: { gte: now }
        }
      }),
      prisma.paymentRequest.count({
        where: {
          status: 'UNDER_REVIEW'
        }
      })
    ]);

    return res.status(200).json(
      apiResponse({
        totalUsers,
        newUsers24h,
        usersWithActiveSubscription,
        pendingPaymentRequests
      })
    );
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['ADMIN']);
