/**
 * errors.js
 *
 * Utility module for standardized error handling across the application.
 *
 * Features:
 * - Defines a custom `AppError` class that extends the native `Error` object.
 * - Normalizes errors from various sources (network, unknown, API) into `AppError`.
 * - Provides user-friendly error messages (including Hebrew messages).
 */

/**
 * AppError
 * Custom application error class that encapsulates additional metadata.
 *
 * @extends {Error}
 */
export class AppError extends Error {
  /**
   * @param {object} params
   * @param {string} params.code - Application-level error code (e.g., "NETWORK_ERROR").
   * @param {string} params.message - Human-readable error message.
   * @param {number} [params.status] - Optional HTTP status code.
   * @param {any} [params.details] - Optional additional details for debugging.
   */
  constructor({ code, message, status, details }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * createError
 * Normalizes an error into an `AppError` instance.
 *
 * Features:
 * - Returns the same error if it's already an `AppError`.
 * - Converts network/fetch errors into a "NETWORK_ERROR".
 * - Falls back to "UNKNOWN_ERROR" for unrecognized errors.
 *
 * @param {Error|any} err - Original error object.
 * @param {number} [status] - Optional HTTP status code to attach.
 * @returns {AppError} Standardized application error.
 *
 * @example
 * try {
 *   await fetch("/api/data");
 * } catch (err) {
 *   throw createError(err, 500);
 * }
 */
export function createError(err, status) {
  if (err instanceof AppError) return err;

  if (err.name === "TypeError" && err.message.includes("fetch")) {
    return new AppError({
      code: "NETWORK_ERROR",
      message: "לא הצלחנו להתחבר לשרת. בדוק חיבור אינטרנט.",
    });
  }

  return new AppError({
    code: "UNKNOWN_ERROR",
    message: err.message || "אירעה שגיאה לא צפויה",
    status,
  });
}