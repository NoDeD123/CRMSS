import fs from 'fs';
import path from 'path';
import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  const userId = req.user.userId;

  if (req.method === 'GET') {
    try {
      const documents = await prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(apiResponse(documents));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json(apiResponse(null, 'Bad request: Brak id dokumentu'));
      }

      const doc = await prisma.document.findUnique({ where: { id } });

      if (!doc || doc.userId !== userId) {
        return res.status(403).json(apiResponse(null, 'Nieautoryzowany dostęp lub brak pliku.'));
      }

      // Format physical path
      const parts = doc.fileUrl.split('/');
      const filename = parts[parts.length - 1];
      const safePath = path.join(process.cwd(), 'storage', 'uploads', 'documents', userId, filename);

      if (fs.existsSync(safePath)) {
        fs.unlinkSync(safePath);
      }

      await prisma.document.delete({ where: { id } });

      return res.status(200).json(apiResponse(null, null, 'Dokument został trwale usunięty.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['USER']);
