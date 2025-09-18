// api/units.js
import { API_UNITS } from "../utils/constants";

/**
 * fetchUnits
 *
 * Fetches measurement units from a predefined API endpoint.
 *
 * @returns {Promise<Array>} - Array of unit objects
 * @throws {Error} - Throws an error if fetching fails
 */
export const fetchUnits = () =>
  fetch(API_UNITS)
    .then(res => res.json())
    .catch(() => { throw new Error("שגיאה בשליפת יחידות"); });
