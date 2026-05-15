import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  const userId = req.user.userId;

  if (req.method === 'GET') {
    try {
      const [sumSales, sumPayouts, payouts] = await Promise.all([
        prisma.invoice.aggregate({
          where: { userId, type: 'SALES', status: 'PAID' },
          _sum: { grossAmount: true }
        }),
        prisma.paymentRequest.aggregate({
          where: {
            userId,
            status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PAID'] }
          },
          _sum: { amount: true }
        }),
        prisma.paymentRequest.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      const income = Number(sumSales._sum.grossAmount || 0);
      const pendingPayouts = Number(sumPayouts._sum.amount || 0);
      const calculatedBalance = income - pendingPayouts;

      return res.status(200).json(apiResponse({
        accountBalance: calculatedBalance.toFixed(2),
        payouts
      }));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { amount } = req.body;
      const withdrawAmount = Number(amount);

      if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return res.status(400).json(apiResponse(null, 'Nieprawidłowa kwota wypłaty.'));
      }

      // Check balance safely
      const [sumSales, sumPayouts] = await Promise.all([
        prisma.invoice.aggregate({
          where: { userId, type: 'SALES', status: 'PAID' },
          _sum: { grossAmount: true }
        }),
        prisma.paymentRequest.aggregate({
          where: {
            userId,
            status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PAID'] }
          },
          _sum: { amount: true }
        })
      ]);

      const income = Number(sumSales._sum.grossAmount || 0);
      const pendingPayouts = Number(sumPayouts._sum.amount || 0);
      const availableBalance = income - pendingPayouts;

      if (withdrawAmount > availableBalance) {
        return res.status(400).json(apiResponse(null, `Brak wystarczających środków (Dostępne: ${availableBalance.toFixed(2)} PLN).`));
      }

      const totalRequests = await prisma.paymentRequest.count();
      const currentYear = new Date().getFullYear();
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const requestNumber = `W/[${totalRequests + 1}]/${currentMonth}/${currentYear}`;

      const newRequest = await prisma.paymentRequest.create({
        data: {
          requestNumber,
          amount: withdrawAmount,
          title: `Zlecenie wypłaty z panelu by uzytkownik`,
          status: 'SUBMITTED',
          userId: userId
        }
      });

      return res.status(201).json(apiResponse(newRequest, null, 'Pomyślnie utworzono żądanie wypłaty.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['USER', 'FREELANCER']);
