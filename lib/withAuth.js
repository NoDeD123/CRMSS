import { verifyToken } from './auth.js';
import { apiResponse } from './apiResponse.js';

export function withAuth(handler, allowedRoles = []) {
  return async (req, res) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json(apiResponse(null, 'Authentication token missing'));
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json(apiResponse(null, 'Invalid or expired token'));
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json(apiResponse(null, 'Forbidden: Insufficient privileges'));
      }

      req.user = decoded;

      return await handler(req, res);
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(500).json(apiResponse(null, 'Internal Server Error'));
    }
  };
}
