import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(apiResponse(null, 'Missing email'));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // W wersji produkcyjnej tutaj wysyłalibyśmy e-mail z tokenem do resetowania hasła (np. przez nodemailer/SendGrid)
      // Ponieważ to jest wersja MVP mockujemy tę funkcję i zawsze zwracamy sukces
      console.log(`Mock: Wysyłam link do resetowania hasła dla ${user.email}`);
    }

    // Zwracamy success zawsze dla poprawnego działania security (zapobieganie wyciekowi czy e-mail istnieje w bazie)
    return res.status(200).json(apiResponse({ success: true }, null, 'Password reset email sent'));

  } catch (error) {
    return errorHandler(error, res);
  }
}
