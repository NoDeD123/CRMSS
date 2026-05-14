import { prisma } from '../../../lib/prisma';
import { apiResponse } from '../../../lib/apiResponse';
import { errorHandler } from '../../../lib/errorHandler';
import { signToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method not allowed'));
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(apiResponse(null, 'Missing email or password'));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json(apiResponse(null, 'Invalid credentials'));
    }

    if (user.role !== 'FREELANCER') {
      return res.status(403).json(
        apiResponse(null, 'To nie jest konto freelancera — użyj logowania dla beneficjenta.')
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json(apiResponse(null, 'Invalid credentials'));
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    }));

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(apiResponse({ user: userWithoutPassword }, null, 'Login successful'));
  } catch (error) {
    return errorHandler(error, res);
  }
}
