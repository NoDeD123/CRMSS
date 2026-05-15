import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const coordinatorId = req.user.userId;

    const [users, unreadGroups] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'USER' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          ownAffiliation: true,
          sentMessages: {
            where: { receiverId: coordinatorId },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          receivedMessages: {
            where: { senderId: coordinatorId },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }),
      prisma.message.groupBy({
        by: ['senderId'],
        where: { receiverId: coordinatorId, isRead: false },
        _count: { id: true }
      })
    ]);

    const unreadMap = new Map();
    for (const group of unreadGroups) {
      unreadMap.set(group.senderId, group._count.id);
    }

    const resolvedUsers = users.map(user => {
      const sent = user.sentMessages[0];
      const received = user.receivedMessages[0];

      let lastMessage = null;
      if (sent && received) {
        lastMessage = sent.createdAt > received.createdAt ? sent : received;
      } else {
        lastMessage = sent || received || null;
      }

      return {
        id: user.id,
        unique_id: user.ownAffiliation || 'BRAK',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Beneficjent',
        lastMsg: lastMessage ? lastMessage.createdAt : null,
        snippet: lastMessage ? lastMessage.content : null,
        unread: unreadMap.get(user.id) || 0
      };
    });

    const contactedBeneficiaries = resolvedUsers.filter(u => u.lastMsg !== null).sort((a, b) => b.lastMsg - a.lastMsg);
    const nonContactedBeneficiaries = resolvedUsers.filter(u => u.lastMsg === null).map(u => ({ ...u, status: 'Nowy' }));

    return res.status(200).json(apiResponse({
      contactedBeneficiaries,
      nonContactedBeneficiaries
    }));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['COORDINATOR', 'ADMIN']);
