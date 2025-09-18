/**
 * middleware/errorHandler.js
 * -----------------------------
 * Global error handling middleware for Express.
 *
 * Purpose:
 *   Catch all errors thrown in controllers or other middleware
 *   and send a uniform response to the client.
 *
 * Notes:
 *   - Logs the error (can be extended to send to Sentry or another logging service)
 *   - Returns HTTP status code and error message in JSON
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Express next middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err); // Can extend to advanced logging or Sentry

  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({ error: message });
};