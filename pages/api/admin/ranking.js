import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    // Ranking dotyczy beneficjentow: liczba oplaconych wyplat + saldo konta.
    const [beneficiaries, paidPayoutsByUser] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'USER' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          accountBalance: true
        }
      }),
      prisma.paymentRequest.groupBy({
        by: ['userId'],
        where: { status: 'PAID' },
        _count: { id: true }
      })
    ]);

    const paidCountMap = new Map(
      paidPayoutsByUser.map((entry) => [entry.userId, entry._count.id])
    );

    const ranking = beneficiaries
      .map((user) => ({
        id: user.id,
        name:
          (user.firstName || user.lastName)
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
            : user.email,
        email: user.email,
        role: user.role,
        payoutCount: paidCountMap.get(user.id) || 0,
        accountBalance: Number(user.accountBalance || 0)
      }))
      .sort((a, b) => {
        if (b.payoutCount !== a.payoutCount) return b.payoutCount - a.payoutCount;
        return b.accountBalance - a.accountBalance;
      })
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return res.status(200).json(apiResponse(ranking));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['ADMIN']);
