import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';
import { withAuth } from '../../../lib/withAuth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        email: true,
        emailVerifiedAt: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json(
        apiResponse(null, 'Brak użytkownika dla tej sesji — wyloguj się i zaloguj ponownie jako freelancer.')
      );
    }

    if (user.role !== 'FREELANCER') {
      return res.status(403).json(
        apiResponse(
          null,
          `To konto ma w bazie rolę „${user.role}”, a nie freelancera. Zaloguj się na właściwy typ konta.`
        )
      );
    }

    return res.status(200).json(
      apiResponse({
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      })
    );
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['FREELANCER']);
