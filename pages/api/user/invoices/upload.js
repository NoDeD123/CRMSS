import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const userId = req.user.userId;
    // Security Fix: Move uploads out of public directory to prevent unauthenticated access (IDOR)
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'invoices', userId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10mb
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(500).json(apiResponse(null, 'Error parsing form data'));
        }

      const file = files.file?.[0] || files.file;

      if (!file) {
        return res.status(400).json(apiResponse(null, 'No file uploaded'));
      }

      // Security Check: Validate strict file extension to prevent Stored XSS
      // Relying solely on file.mimetype is insecure as it is easily spoofable by attackers.
      const ext = path.extname(file.originalFilename || file.newFilename || '').toLowerCase();
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

      if (!allowedExtensions.includes(ext)) {
        // Remove the malicious/unsupported file
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
        return res.status(400).json(apiResponse(null, 'Invalid file type. Only JPG, PNG, and PDF are allowed.'));
      }

      const { invoiceNumber, issueDate, netAmount, grossAmount, sellerName, sellerNip, description } = fields;

      // Ensure single string values if formidable wraps in array
      const getFieldValue = (field) => Array.isArray(field) ? field[0] : field;

      // Use protected API route instead of direct public path
      const fileUrl = `/api/files/invoices/${userId}/${path.basename(file.filepath)}`;

      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber: getFieldValue(invoiceNumber) || `KOSZT-${Date.now()}`,
          type: 'COST',
          status: 'PENDING',
          issueDate: new Date(getFieldValue(issueDate) || Date.now()),
          netAmount: parseFloat(getFieldValue(netAmount) || 0),
          grossAmount: parseFloat(getFieldValue(grossAmount) || 0),
          vatAmount: parseFloat(getFieldValue(grossAmount) || 0) - parseFloat(getFieldValue(netAmount) || 0),
          sellerName: getFieldValue(sellerName) || 'Nieznany',
          sellerNip: getFieldValue(sellerNip) || null,
          buyerName: 'Nasza Fundacja', // Domyślny kupiec
          description: getFieldValue(description) || null,
          fileUrl,
          userId,
        }
        });

        return res.status(201).json(apiResponse(newInvoice, null, 'Invoice uploaded successfully'));
      } catch (dbError) {
        if (dbError.code === 'P2002') {
          return res.status(400).json(apiResponse(null, 'Faktura o podanym numerze została już wprowadzona do bazy. Wpisz unikalny numer dokumentu.'));
        }
        return res.status(500).json(apiResponse(null, 'Wystąpił błąd podczas ewidencjonowania faktury.'));
      }
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'ACCOUNTANT', 'FREELANCER']);
