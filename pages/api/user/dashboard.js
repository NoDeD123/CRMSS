import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../lib/apiResponse.js';
import { errorHandler } from '../../../lib/errorHandler.js';
import { withAuth } from '../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        firstName: true,
        lastName: true,
        companyName: true,
        nextPaymentDate: true,
        subscriptionFee: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json(apiResponse(null, 'User not found'));
    }

    // Calculating days to next payment for reminder flag
    let daysToPayment = null;
    let needsReminder = false;

    if (user.nextPaymentDate) {
      const today = new Date();
      const paymentDate = new Date(user.nextPaymentDate);
      const diffTime = paymentDate.getTime() - today.getTime();
      daysToPayment = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Remind if 5 or less days remaining
      if (daysToPayment <= 5 && daysToPayment >= 0) {
        needsReminder = true;
      }
    }

    let isBlockedForNonPayment = false;
    if (user.nextPaymentDate) {
      const today = new Date();
      const paymentDate = new Date(user.nextPaymentDate);
      const overdueMs = today.getTime() - paymentDate.getTime();
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));

      // Blokada od dnia po przekroczeniu terminu płatności.
      if (overdueDays > 0) {
        isBlockedForNonPayment = true;
      }
    }

    const userId = req.user.userId;

    const pendingInvoices = await prisma.invoice.count({
      where: { userId, status: 'PENDING' }
    });

    const unreadMessages = await prisma.message.count({
      where: { receiverId: userId, isRead: false }
    });

    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    // --- LOGIKA WYLICZANIA SALDA W LOCIE ---
    // User logic: Invoice with status PAID means "Zapłacona przez klienta" (saldo rośnie, beneficjent może wypłacić)
    // Invoice with status WITHDRAW means "Wypłacona przez fundacje na konto beneficjenta" (już nie jest PAID, wypada z salda).
    const sumSales = await prisma.invoice.aggregate({
      where: { userId, type: 'SALES', status: 'PAID' },
      _sum: { grossAmount: true }
    });
    
    const calculatedBalance = Number(sumSales._sum.grossAmount || 0);

    const payload = {
      user: {
        firstName: user.firstName?.trim() ? user.firstName.trim() : null,
        companyName: user.companyName || null,
        joinedDate: user.createdAt,
        accountBalance: calculatedBalance.toFixed(2)
      },
      stats: {
        pendingDocuments: pendingInvoices,
        unreadMessages: unreadMessages
      },
      events: events,
      subscription: {
        fee: user.subscriptionFee,
        nextPaymentDate: user.nextPaymentDate,
        daysToPayment,
        needsReminder,
        isActive: daysToPayment !== null && daysToPayment >= 0,
        isBlockedForNonPayment
      }
    };

    return res.status(200).json(apiResponse(payload));
  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withAuth(handler, ['USER']);
