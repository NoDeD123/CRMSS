import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';
import { withAuth } from '../../../lib/withAuth';

function normalizePhone(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.replace(/\s/g, '').replace(/-/g, '');
  if (s.startsWith('+48')) s = s.slice(3);
  if (s.startsWith('48') && s.length > 9) s = s.slice(2);
  return s.length ? s : null;
}

function isValidPlPhone(digits) {
  if (!digits || typeof digits !== 'string') return false;
  if (!/^\d+$/.test(digits)) return false;
  return digits.length >= 9 && digits.length <= 11;
}

async function handler(req, res) {
  const userId = req.user.userId;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          pesel: true,
        },
      });

      if (!user || user.role !== 'FREELANCER') {
        return res.status(403).json(apiResponse(null, 'Brak dostępu.'));
      }

      return res.status(200).json(
        apiResponse({
          email: user.email,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          phone: user.phone ?? '',
          pesel: user.pesel ?? '',
        })
      );
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'PATCH') {
    try {
      const me = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!me || me.role !== 'FREELANCER') {
        return res.status(403).json(apiResponse(null, 'Brak dostępu.'));
      }

      const body = req.body || {};
      const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
      const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
      const phoneNorm = normalizePhone(body.phone ?? '');

      if (!firstName || !lastName) {
        return res.status(400).json(apiResponse(null, 'Imię i nazwisko są wymagane.'));
      }

      if (!phoneNorm || !isValidPlPhone(phoneNorm)) {
        return res.status(400).json(
          apiResponse(null, 'Podaj poprawny numer telefonu (min. 9 cyfr).')
        );
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phone: phoneNorm,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          pesel: true,
        },
      });

      return res.status(200).json(
        apiResponse(
          {
            email: updated.email,
            firstName: updated.firstName ?? '',
            lastName: updated.lastName ?? '',
            phone: updated.phone ?? '',
            pesel: updated.pesel ?? '',
          },
          null,
          'Dane zostały zapisane.'
        )
      );
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['FREELANCER']);
