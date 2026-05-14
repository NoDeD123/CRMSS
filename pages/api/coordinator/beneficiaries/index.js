import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    // Koordynator widzi tylko swoich beneficjentow, admin widzi wszystkich.
    const beneficiariesWhere = { role: 'USER' };
    if (req.user.role === 'COORDINATOR') {
      beneficiariesWhere.coordinatorId = req.user.userId;
    }

    const beneficiaries = await prisma.user.findMany({
      where: beneficiariesWhere,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        ownAffiliation: true,
        createdAt: true,
        invoices: {
          where: { status: 'PENDING' },
          select: { id: true }
        },
        paymentRequests: {
          where: { status: 'SUBMITTED' },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const mappedBeneficiaries = beneficiaries.map(b => {
      const pendingCount = b.invoices.length + b.paymentRequests.length;
      return {
        id: b.id,
        unique_id: b.ownAffiliation || 'BRAK',
        first_name: b.firstName,
        last_name: b.lastName,
        beneficiary_name: `${b.firstName || ''} ${b.lastName || ''}`.trim() || 'Nieuzupełniono',
        email: b.email,
        phone_number: 'Brak danych', // MVP mock for phone since it's not in schema yet
        status: pendingCount > 0 ? 'Oczekujący dokument' : 'Aktywny',
        pendingDocumentsCount: pendingCount
      };
    });

    return res.status(200).json(apiResponse(mappedBeneficiaries));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['COORDINATOR', 'ADMIN']);
