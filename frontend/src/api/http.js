import { AppError, createError } from "../utils/errors";

/**
 * request
 * Helper function for standardized API calls.
 *
 * Features:
 * - Handles JSON requests & responses
 * - Throws AppError with meaningful messages for network/server errors
 *
 * @param {string} url - full URL (from constants)
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} parsed JSON response
 */
export async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    if (!res.ok) {
      let serverMessage = null;
      try {
        const data = await res.json();
        serverMessage = data.message || data.error;
      } catch {}

      throw new AppError({
        code: res.status === 401 ? "AUTH_ERROR" : "SERVER_ERROR",
        message: serverMessage || `שגיאת שרת (${res.status})`,
        status: res.status,
      });
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    throw createError(err);
  }
}
