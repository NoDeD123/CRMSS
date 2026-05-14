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
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'documents', userId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024, // 25mb max per doc
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(500).json(apiResponse(null, 'Error parsing form data'));
        }

        const file = files.file?.[0] || files.file;

        if (!file) {
          return res.status(400).json(apiResponse(null, 'Nie dostarczono pliku.'));
        }

        const ext = path.extname(file.originalFilename || file.newFilename || '').toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

        if (!allowedExtensions.includes(ext)) {
          if (fs.existsSync(file.filepath)) fs.unlinkSync(file.filepath);
          return res.status(400).json(apiResponse(null, 'Nieobsługiwany format. Tylko PDF, DOC, DOCX, JPG, PNG.'));
        }

        const fileUrl = `/api/files/documents/${userId}/${path.basename(file.filepath)}`;

        const newDocument = await prisma.document.create({
          data: {
            originalName: file.originalFilename || 'unnamed_file',
            fileUrl,
            sizeBytes: file.size,
            userId,
          }
        });

        return res.status(201).json(apiResponse(newDocument, null, 'Dokument wgrany poprawnie.'));
      } catch (dbError) {
        console.error(dbError);
        return res.status(500).json(apiResponse(null, 'Wystąpił błąd podczas ewidencji pliku w bazie.'));
      }
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER']);
