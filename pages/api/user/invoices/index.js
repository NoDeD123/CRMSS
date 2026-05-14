import { prisma } from '../../../../lib/prisma';
import { apiResponse } from '../../../../lib/apiResponse';
import { errorHandler } from '../../../../lib/errorHandler';
import { withAuth } from '../../../../lib/withAuth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const invoices = await prisma.invoice.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(apiResponse(invoices));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      // Basic extraction mimicking what might come from the frontend MVP
      const {
        invoiceNumber,
        type,
        issueDate,
        dueDate,
        netAmount,
        grossAmount,
        vatAmount,
        sellerName,
        buyerName,
        buyerEmail,
        description
      } = req.body;

      if (!invoiceNumber || !type || !issueDate || !netAmount || !grossAmount || !vatAmount || !sellerName || !buyerName) {
        return res.status(400).json(apiResponse(null, 'Missing required fields'));
      }

      // Validating type
      if (type !== 'SALES' && type !== 'COST') {
        return res.status(400).json(apiResponse(null, 'Invalid invoice type'));
      }

      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          type,
          issueDate: new Date(issueDate),
          dueDate: dueDate ? new Date(dueDate) : null,
          netAmount,
          grossAmount,
          vatAmount,
          sellerName,
          buyerName,
          buyerEmail: buyerEmail || null,
          description,
          userId: req.user.userId
        }
      });

      return res.status(201).json(apiResponse(newInvoice, null, 'Invoice created successfully'));
    } catch (error) {
      if (error.code === 'P2002') {
         return res.status(400).json(apiResponse(null, 'Invoice number already exists'));
      }
      return errorHandler(error, res);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json(apiResponse(null, 'Bad request: Brak ID.'));
      }

      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice || invoice.userId !== req.user.userId) {
        return res.status(403).json(apiResponse(null, 'Odmowa dostępu.'));
      }

      if (invoice.status === 'PAID') {
        return res.status(403).json(apiResponse(null, 'Nie można kasować opłaconych (zakiegowanych) faktur. Skontaktuj się z administracją.'));
      }

      if (invoice.fileUrl) {
         const parts = invoice.fileUrl.split('/');
         const filename = parts[parts.length - 1];
         const safePath = require('path').join(process.cwd(), 'storage', 'uploads', 'invoices', req.user.userId, filename);
         const fs = require('fs');
         if (fs.existsSync(safePath)) {
            fs.unlinkSync(safePath);
         }
      }

      await prisma.invoice.delete({ where: { id } });
      return res.status(200).json(apiResponse(null, null, 'Faktura usunięta.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'ACCOUNTANT', 'FREELANCER']);
