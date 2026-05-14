import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL ERROR: JWT_SECRET is not defined in production environment.');
    }
    console.warn('WARNING: Using insecure development JWT_SECRET.');
    return 'super-secret-key-for-development-only';
  }
  return process.env.JWT_SECRET;
};

export function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
}
