import { apiResponse } from './apiResponse.js';

export function errorHandler(err, res) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json(apiResponse(null, message));
}
