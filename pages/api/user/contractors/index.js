import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  const userId = req.user.userId;

  if (req.method === 'GET') {
    try {
      const contractors = await prisma.contractor.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(apiResponse(contractors));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { contractorName, nip, email, phone } = req.body;

      if (!contractorName) {
        return res.status(400).json(apiResponse(null, 'Nazwa firmy jest wymagana'));
      }

      const newContractor = await prisma.contractor.create({
        data: {
          contractorName,
          nip: nip || null,
          email: email || null,
          phone: phone || null,
          userId
        }
      });

      return res.status(201).json(apiResponse(newContractor, null, 'Dodano kontrahenta pomyślnie'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // zakladamy query.id jesli bysmy kasowali uderzajac w /api/user/contractors?id=XYZ

      if (!id) return res.status(400).json(apiResponse(null, 'Brak ID do usunięcia'));

      const deleteResult = await prisma.contractor.deleteMany({
        where: { id, userId }
      });

      if (deleteResult.count === 0) {
        return res.status(404).json(apiResponse(null, 'Nie znaleziono kontrahenta'));
      }

      return res.status(200).json(apiResponse(null, null, 'Usunięto kontrahenta'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR']);
