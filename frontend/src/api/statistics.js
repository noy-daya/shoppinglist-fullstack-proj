// api/statistics.js
import { request } from "./http";
import { API_STATISTICS } from "../utils/constants";

/**
 * fetchMonthlyStats
 *
 * Fetches aggregated statistics for all lists for a given month.
 *
 * @param {string} month - Month in format "YYYY-MM" (e.g., "2025-09")
 * @returns {Promise<Object>} - Monthly statistics data including lists and their categories
 */
export const fetchMonthlyStats = (month) =>
  request(`${API_STATISTICS}/monthly?month=${month}`);

/**
 * fetchListStats
 *
 * Fetches detailed statistics for a specific list, optionally filtered by month.
 *
 * @param {number|string} listId - The ID of the list
 * @param {string} [month] - Optional month filter in "YYYY-MM" format
 * @returns {Promise<Object>} - Statistics data for the list including category breakdown
 */
export const fetchListStats = (listId, month) => {
  const url = `${API_STATISTICS}/list/${listId}` + (month ? `?month=${month}` : "");
  return request(url);
};