import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json(apiResponse(null, 'Wszystkie pola są wymagane'));
    }

    if (newPassword.length < 8) {
      return res.status(400).json(apiResponse(null, 'Nowe hasło musi mieć minimum 8 znaków'));
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json(apiResponse(null, 'Nowe hasła nie są identyczne'));
    }

    if (currentPassword === newPassword) {
      return res.status(400).json(apiResponse(null, 'Nowe hasło musi się różnić od obecnego'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, password: true }
    });

    if (!user) {
      return res.status(404).json(apiResponse(null, 'Użytkownik nie został znaleziony'));
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json(apiResponse(null, 'Obecne hasło jest nieprawidłowe'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json(apiResponse({ success: true }, null, 'Hasło zostało zmienione'));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER', 'FREELANCER']);
