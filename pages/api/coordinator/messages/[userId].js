import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  const { userId } = req.query; // to id beneficjenta
  const coordinatorId = req.user.userId;

  if (req.method === 'GET') {
    try {
      // Oznacz wszystkie wiadomosci otrzymane od tego beneficjenta jako przeczytane
      await prisma.message.updateMany({
        where: {
          senderId: userId,
          receiverId: coordinatorId,
          isRead: false
        },
        data: { isRead: true }
      });

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: coordinatorId, receiverId: userId },
            { senderId: userId, receiverId: coordinatorId }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      const mappedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.createdAt,
        isFromMe: msg.senderId === coordinatorId
      }));

      return res.status(200).json(apiResponse(mappedMessages));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { content } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json(apiResponse(null, 'Wiadomość nie może być pusta'));
      }

      const newMsg = await prisma.message.create({
        data: {
          content: content.trim(),
          senderId: coordinatorId,
          receiverId: userId
        }
      });

      return res.status(201).json(apiResponse({
        id: newMsg.id,
        content: newMsg.content,
        timestamp: newMsg.createdAt,
        isFromMe: true
      }));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['COORDINATOR', 'ADMIN']);
