export function apiResponse(data = null, error = null, message = '') {
  return {
    data,
    error,
    message
  };
}
