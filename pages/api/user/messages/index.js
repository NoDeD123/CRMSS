import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  const userId = req.user.userId;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coordinatorId: true }
      });

      if (!user?.coordinatorId) {
        return res.status(200).json(apiResponse({ coordinator: null, messages: [] }));
      }

      const coordinator = await prisma.user.findUnique({
        where: { id: user.coordinatorId },
        select: { id: true, firstName: true, lastName: true }
      });

      if (!coordinator) {
        return res.status(200).json(apiResponse({ coordinator: null, messages: [] }));
      }

      // Mark received messages as read
      await prisma.message.updateMany({
        where: {
          senderId: coordinator.id,
          receiverId: userId,
          isRead: false
        },
        data: { isRead: true }
      });

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: coordinator.id },
            { senderId: coordinator.id, receiverId: userId }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      const mappedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.createdAt,
        isFromMe: msg.senderId === userId
      }));

      return res.status(200).json(apiResponse({
        coordinator: {
          id: coordinator.id,
          name: `${coordinator.firstName || 'Twój'} ${coordinator.lastName || 'Koordynator'}`.trim()
        },
        messages: mappedMessages
      }));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { content, coordinatorId } = req.body;

      if (!content || !coordinatorId) {
        return res.status(400).json(apiResponse(null, 'Wiadomość i ID Odbiorcy są wymagane'));
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coordinatorId: true }
      });

      if (!user?.coordinatorId) {
        return res.status(400).json(apiResponse(null, 'Brak przypisanego koordynatora do konta użytkownika'));
      }

      if (user.coordinatorId !== coordinatorId) {
        return res.status(403).json(apiResponse(null, 'Możesz pisać tylko do przypisanego koordynatora'));
      }

      const newMsg = await prisma.message.create({
        data: {
          content: content.trim(),
          senderId: userId,
          receiverId: coordinatorId
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

export default withAuth(handler, ['USER']);
