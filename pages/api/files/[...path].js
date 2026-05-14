import path from 'path';
import fs from 'fs';
import { withAuth } from '../../../lib/withAuth.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { prisma } from '../../../lib/prisma.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  const { path: filePathParams } = req.query;

  if (!filePathParams || !Array.isArray(filePathParams) || filePathParams.length === 0) {
    return res.status(400).json(apiResponse(null, 'Invalid file path'));
  }

  // Security Fix: Prevent IDOR / Directory Traversal
  // Sanitize each part of the path array to ensure no malicious '..' patterns are parsed
  const sanitizedParams = filePathParams.map(segment => {
    // Remove all characters except alphanumeric, dot, dash, underscore
    const clean = segment.replace(/[^a-zA-Z0-9.\-_]/g, '');
    if (clean === '..') return '';
    return clean;
  }).filter(Boolean);

  if (sanitizedParams.length < 3) { // Require folderType, userId, and filename
    return res.status(400).json(apiResponse(null, 'Invalid path structure'));
  }

  const [folderType, fileOwnerId] = sanitizedParams;

  // Authorization Check - strictly tie to the sanitized parameter
  const isOwner = req.user.userId === fileOwnerId;
  const isStaff = ['ADMIN', 'COORDINATOR', 'ACCOUNTANT'].includes(req.user.role);

  if (!isOwner && !isStaff) {
    return res.status(403).json(apiResponse(null, 'You do not have permission to view this file.'));
  }

  const ownerInvoiceFileBlockedStatuses = ['PENDING', 'REJECTED'];

  if (
    folderType === 'invoices' &&
    isOwner &&
    ['USER', 'FREELANCER'].includes(req.user.role)
  ) {
    const requestedFileUrl = `/api/files/${sanitizedParams.join('/')}`;
    const relatedInvoice = await prisma.invoice.findFirst({
      where: {
        userId: req.user.userId,
        fileUrl: requestedFileUrl
      },
      select: {
        status: true
      }
    });

    if (relatedInvoice && ownerInvoiceFileBlockedStatuses.includes(relatedInvoice.status)) {
      const msg =
        relatedInvoice.status === 'REJECTED'
          ? 'Faktura została odrzucona — plik nie jest dostępny do pobrania.'
          : 'Proforma czeka na zatwierdzenie — po akceptacji przez koordynatora będzie można pobrać plik.';
      return res.status(423).json(apiResponse(null, msg));
    }
  }

  // Construct absolute path securely
  const safePath = path.join(process.cwd(), 'storage', 'uploads', ...sanitizedParams);

  const storageDir = path.join(process.cwd(), 'storage', 'uploads');
  if (!safePath.startsWith(storageDir)) {
    return res.status(403).json(apiResponse(null, 'Forbidden path access'));
  }

  if (!fs.existsSync(safePath)) {
    return res.status(404).json(apiResponse(null, 'File not found'));
  }

  // Determine Content-Type based on extension
  const ext = path.extname(safePath).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);

  // Stream file to client securely
  const fileStream = fs.createReadStream(safePath);
  fileStream.pipe(res);

  fileStream.on('error', (err) => {
    console.error('File stream error:', err);
    if (!res.headersSent) {
      res.status(500).json(apiResponse(null, 'Internal Server Error'));
    }
  });
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'ACCOUNTANT', 'FREELANCER']);
