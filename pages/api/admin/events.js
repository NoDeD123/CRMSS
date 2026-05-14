import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

const audienceLabels = {
  ALL: 'Wszyscy',
  ACCOUNTANT: 'Księgowi',
  COORDINATOR: 'Koordynatorzy',
  USER: 'Beneficjenci'
};

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      return res.status(200).json(apiResponse(events));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content, audience } = req.body;

      if (!title) {
        return res.status(400).json(apiResponse(null, 'Tytuł ogłoszenia jest wymagany'));
      }

      const now = new Date();
      const month = now.toLocaleString('pl-PL', { month: 'long' });
      const day = String(now.getDate());
      const audienceLabel = audienceLabels[audience] || audienceLabels.ALL;

      const eventTitle = content
        ? `[${audienceLabel}] ${title} - ${content}`
        : `[${audienceLabel}] ${title}`;

      const event = await prisma.event.create({
        data: {
          title: eventTitle,
          day,
          month
        }
      });

      return res.status(201).json(apiResponse(event, null, 'Ogłoszenie zapisane do wydarzeń'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json(apiResponse(null, 'Brakuje identyfikatora wydarzenia'));
      }

      await prisma.event.delete({
        where: { id }
      });

      return res.status(200).json(apiResponse({ id }, null, 'Ogłoszenie usunięte'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['ADMIN']);
