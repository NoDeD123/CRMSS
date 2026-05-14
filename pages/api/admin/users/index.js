import { prisma } from '../../../../lib/prisma.js';
import { apiResponse } from '../../../../lib/apiResponse.js';
import { errorHandler } from '../../../../lib/errorHandler.js';
import { withAuth } from '../../../../lib/withAuth.js';
import bcrypt from 'bcryptjs';

const BENEFICIARY_START_NUMBER = 301002;

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { search, role } = req.query;

      let whereClause = {};

      if (search) {
        whereClause.OR = [
          { email: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
        ];
      }

      if (role) {
        whereClause.role = role.toUpperCase();
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          nextPaymentDate: true,
          subscriptionFee: true,
          affiliatedBy: true,
          coordinatorId: true
        }
      });

      return res.status(200).json(apiResponse(users));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, password, firstName, lastName, companyName, role, bankAccount } = req.body;

      if (!email || !password) {
        return res.status(400).json(apiResponse(null, 'Adres e-mail i hasło są wymagane'));
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json(apiResponse(null, 'Konto o tym adresie e-mail już istnieje.'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Map roles if not provided perfectly
      let userRole = 'USER';
      const validRoles = ['ADMIN', 'USER', 'COORDINATOR', 'ACCOUNTANT', 'FINANCE', 'FREELANCER'];
      if (role && validRoles.includes(role.toUpperCase())) {
        userRole = role.toUpperCase();
      }

      // Funkcja generujaca unikalny 6-znakowy kod dla afiliacji (wymaganie usera)
      const generateAffiliationCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      const nextPayment = new Date();
      nextPayment.setMonth(nextPayment.getMonth() + 1);

      let assignedBeneficiaryNumber = null;
      if (userRole === 'USER') {
        const maxBeneficiaryRows = await prisma.$queryRaw`
          SELECT MAX(beneficiaryNumber) AS maxBeneficiaryNumber
          FROM User
        `;
        const maxBeneficiaryNumber = Number(maxBeneficiaryRows?.[0]?.maxBeneficiaryNumber || BENEFICIARY_START_NUMBER - 1);
        assignedBeneficiaryNumber = maxBeneficiaryNumber + 1;
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: firstName || null,
          lastName: lastName || null,
          companyName: companyName || null,
          role: userRole,
          ownAffiliation: generateAffiliationCode(),
          bankAccount: bankAccount || null,
          nextPaymentDate: nextPayment
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          companyName: true,
          role: true,
          ownAffiliation: true,
          createdAt: true,
        }
      });

      if (userRole === 'USER' && assignedBeneficiaryNumber) {
        await prisma.$executeRaw`
          UPDATE User
          SET beneficiaryNumber = ${assignedBeneficiaryNumber}
          WHERE id = ${newUser.id}
        `;
      }

      return res.status(201).json(apiResponse(newUser, null, 'Użytkownik został pomyślnie utworzony.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { beneficiaryId, coordinatorId, paymentRecorded } = req.body;

      if (!beneficiaryId) {
        return res.status(400).json(apiResponse(null, 'Brakuje identyfikatora beneficjenta'));
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: beneficiaryId },
        select: { id: true, role: true, nextPaymentDate: true }
      });

      if (!targetUser || !['USER', 'FREELANCER'].includes(targetUser.role)) {
        return res.status(404).json(apiResponse(null, 'Nie znaleziono użytkownika lub rola nie umożliwia tej operacji.'));
      }

      if (paymentRecorded === true) {
        if (targetUser.role !== 'USER') {
          return res.status(400).json(apiResponse(null, 'Odnotowanie płatności dotyczy wyłącznie beneficjentów.'));
        }

        const now = new Date();
        const baseDate = targetUser.nextPaymentDate && new Date(targetUser.nextPaymentDate) > now
          ? new Date(targetUser.nextPaymentDate)
          : now;
        const nextPaymentDate = new Date(baseDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        const updatedPayment = await prisma.user.update({
          where: { id: beneficiaryId },
          data: { nextPaymentDate },
          select: {
            id: true,
            nextPaymentDate: true
          }
        });

        return res
          .status(200)
          .json(apiResponse(updatedPayment, null, 'Płatność została odnotowana, termin płatności został przedłużony.'));
      }

      let assignedCoordinatorId = null;

      if (coordinatorId) {
        const coordinator = await prisma.user.findUnique({
          where: { id: coordinatorId },
          select: { id: true, role: true }
        });

        if (!coordinator || coordinator.role !== 'COORDINATOR') {
          return res.status(400).json(apiResponse(null, 'Wybrany użytkownik nie jest koordynatorem'));
        }

        assignedCoordinatorId = coordinator.id;
      }

      const updatedUser = await prisma.user.update({
        where: { id: beneficiaryId },
        data: {
          coordinatorId: assignedCoordinatorId
        },
        select: {
          id: true,
          coordinatorId: true,
          nextPaymentDate: true
        }
      });

      return res
        .status(200)
        .json(apiResponse(updatedUser, null, 'Przypisanie koordynatora zostało zaktualizowane.'));
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  return res.status(405).json(apiResponse(null, 'Method not allowed'));
}

// Tylko administratorzy maja tu dostep
export default withAuth(handler, ['ADMIN']);
