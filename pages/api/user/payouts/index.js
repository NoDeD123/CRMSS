import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const payouts = await prisma.paymentRequest.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(apiResponse(payouts));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        requestNumber,
        amount,
        title,
        description,
        bankAccount,
        formData
      } = req.body;

      if (!requestNumber || amount === undefined || !title) {
        return res.status(400).json(apiResponse(null, 'Missing required fields'));
      }

      // Convert amount safely if it comes as string
      let parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        parsedAmount = 0; // Default or fallback logic if no amount specified in standard form
      }

      const newPayout = await prisma.paymentRequest.create({
        data: {
          requestNumber,
          amount: parsedAmount,
          title,
          description,
          bankAccount,
          formData: formData || {}, // Save the React controlled component state
          status: 'SUBMITTED', // Move to submitted straight away since it is filled out
          userId: req.user.userId
        }
      });

      return res.status(201).json(apiResponse(newPayout, null, 'Payment request created successfully'));
    } catch (error) {
      if (error.code === 'P2002') {
         return res.status(400).json(apiResponse(null, 'Request number already exists'));
      }
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

export default withAuth(handler, ['USER', 'ADMIN', 'COORDINATOR', 'ACCOUNTANT', 'FREELANCER']);
