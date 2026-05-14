import { prisma } from '../../../../../lib/prisma.js';
import { apiResponse } from '../../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../../lib/errorHandler.js';
import { withAuth } from '../../../../../lib/withAuth.js';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          ownAffiliation: true,
          coordinatorId: true,
        }
      });

      if (!user) {
        return res.status(404).json(apiResponse(null, 'Beneficiary not found'));
      }

      if (req.user.role === 'COORDINATOR' && user.coordinatorId !== req.user.userId) {
        return res.status(403).json(apiResponse(null, 'Brak dostępu do dokumentów tego beneficjenta'));
      }

      const invoices = await prisma.invoice.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
      });

      const paymentRequests = await prisma.paymentRequest.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
      });

      const allDocs = [
        ...invoices.map(inv => ({
          docId: inv.id,
          docType: 'INVOICE',
          type: inv.type === 'COST' ? 'Faktura Kosztowa' : 'Faktura Sprzedażowa',
          name: inv.invoiceNumber,
          date: inv.issueDate,
          status: inv.status,
          amount: inv.grossAmount,
          fileUrl: inv.fileUrl || null
        })),
        ...paymentRequests.map(req => ({
          docId: req.id,
          docType: 'PAYOUT',
          type: 'Wniosek o Wypłatę',
          name: req.requestNumber,
          date: req.createdAt,
          status: req.status,
          amount: req.amount,
          fileUrl: null
        }))
      ];

      allDocs.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.status(200).json(apiResponse({
        beneficiary: user,
        documents: allDocs
      }));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { docId, docType, action, reason } = req.body;

      const beneficiary = await prisma.user.findUnique({
        where: { id },
        select: { coordinatorId: true }
      });

      if (!beneficiary) {
        return res.status(404).json(apiResponse(null, 'Beneficiary not found'));
      }

      if (req.user.role === 'COORDINATOR' && beneficiary.coordinatorId !== req.user.userId) {
        return res.status(403).json(apiResponse(null, 'Brak dostępu do dokumentów tego beneficjenta'));
      }

      if (!docId || !docType || !action) {
        return res.status(400).json(apiResponse(null, 'Brakuje wymaganych pól'));
      }

      if (action !== 'ACCEPT' && action !== 'REJECT') {
        return res.status(400).json(apiResponse(null, 'Nieprawidłowa akcja'));
      }

      let updateResult = null;
      let newStatus = action === 'ACCEPT' ? 'VERIFIED' : 'REJECTED';

      if (docType === 'INVOICE') {
        updateResult = await prisma.invoice.updateMany({
          where: { id: docId, userId: id, status: 'PENDING' },
          data: {
            status: newStatus,
            description: reason ? `Odrzucono: ${reason}` : undefined
          }
        });
      } else if (docType === 'PAYOUT') {
        newStatus = action === 'ACCEPT' ? 'UNDER_REVIEW' : 'REJECTED';
        updateResult = await prisma.paymentRequest.updateMany({
          where: { id: docId, userId: id, status: 'SUBMITTED' },
          data: {
            status: newStatus,
            description: reason ? `Odrzucono: ${reason}` : undefined
          }
        });
      } else {
        return res.status(400).json(apiResponse(null, 'Nieznany typ dokumentu'));
      }

      if (updateResult.count === 0) {
        return res.status(404).json(apiResponse(null, 'Nie znaleziono dokumentu przypisanego do tego beneficjenta'));
      }

      return res.status(200).json(apiResponse({ updatedId: docId, status: newStatus }, null, 'Status dokumentu zaktualizowany'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['COORDINATOR', 'ADMIN', 'ACCOUNTANT']);
