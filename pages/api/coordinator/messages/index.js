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

    // Pobranie beneficjentow wraz z ich najnowsza wiadomoscia odebrana lub wyslana przez koordynatora
    const users = await prisma.user.findMany({
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
    });

    const mappedUsers = users.map(user => {
      const sent = user.sentMessages[0];
      const received = user.receivedMessages[0];

      let lastMessage = null;
      if (sent && received) {
        lastMessage = sent.createdAt > received.createdAt ? sent : received;
      } else {
        lastMessage = sent || received || null;
      }

      // Count unread from this user specifically to this coordinator
      const unreadCountPromise = prisma.message.count({
        where: { senderId: user.id, receiverId: coordinatorId, isRead: false }
      });

      return {
        id: user.id,
        unique_id: user.ownAffiliation || 'BRAK',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Beneficjent',
        lastMsg: lastMessage ? lastMessage.createdAt : null,
        snippet: lastMessage ? lastMessage.content : null,
        unreadCountPromise
      };
    });

    // Execute unread counts concurrently
    const resolvedUsers = await Promise.all(
      mappedUsers.map(async u => {
        const unread = await u.unreadCountPromise;
        delete u.unreadCountPromise;
        return { ...u, unread };
      })
    );

    // Separating into contacted and non-contacted
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
