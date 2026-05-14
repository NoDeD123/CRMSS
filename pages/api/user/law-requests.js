import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

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
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'law-requests', userId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(500).json(apiResponse(null, 'Error parsing form data'));
        }

        const getFieldValue = (field) => Array.isArray(field) ? field[0] : field;
        const description = getFieldValue(fields.description);
        const wantsMeeting = getFieldValue(fields.wantsMeeting) === 'true';
        const attachment = files.attachment?.[0] || files.attachment;

        if (!description || description.toString().trim().length < 10) {
          return res.status(400).json(apiResponse(null, 'Opis problemu jest wymagany (minimum 10 znaków).'));
        }

        let attachmentUrl = null;
        if (attachment) {
          const ext = path.extname(attachment.originalFilename || attachment.newFilename || '').toLowerCase();
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
          if (!allowedExtensions.includes(ext)) {
            if (fs.existsSync(attachment.filepath)) {
              fs.unlinkSync(attachment.filepath);
            }
            return res.status(400).json(apiResponse(null, 'Niedozwolony typ załącznika'));
          }
          attachmentUrl = `/api/files/law-requests/${userId}/${path.basename(attachment.filepath)}`;
        }

        await prisma.legalRequest.create({
          data: {
            description: description.toString().trim(),
            wantsMeeting,
            attachmentUrl,
            userId
          }
        });

        return res.status(201).json(apiResponse(null, null, 'Zgłoszenie prawne zostało wysłane do administratora.'));
      } catch (parseError) {
        return errorHandler(parseError, res);
      }
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER']);
