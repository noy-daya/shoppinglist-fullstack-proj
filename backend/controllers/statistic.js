/**
 * controllers/statistic.js
 * -----------------------------
 * Controller for handling statistics-related endpoints.
 *
 * Responsibilities:
 * - Receive HTTP requests related to statistics.
 * - Delegate business logic to the statistics service (`statsService`).
 * - Format and send JSON responses to the client.
 *
 * Each function is wrapped in `asyncHandler` to automatically forward errors
 * to the global error handler middleware.
 */

import { asyncHandler } from '../middleware/asyncHandler.js';
import * as statsService from '../services/statistic.js';

/**
 * Retrieve monthly statistics for all lists created within a specified month.
 *
 * HTTP Method: GET
 * Path: /api/statistics/monthly
 *
 * Query Parameters:
 *   - month (string, required, format: "YYYY-MM")
 *
 * Response:
 *   200 OK
 *   {
 *     month: "YYYY-MM",
 *     lists: [
 *       {
 *         id: number,
 *         name: string,
 *         createdAt: string (ISO date),
 *         totalQuantity: number,
 *         categories: [
 *           {
 *             categoryId: number,
 *             categoryName: string,
 *             quantity: number,
 *             percent: number
 *           }
 *         ]
 *       }
 *     ]
 *   }
 *
 * Behavior:
 *   - Parses the `month` query parameter using `statsService.parseMonth`.
 *   - Retrieves lists created in that month via `statsService.getListsInRange`.
 *   - If no lists exist, returns an empty array.
 *   - Retrieves items for those lists and computes category breakdown.
 */
export const getMonthlyStats = asyncHandler(async (req, res) => {
  const { start, end } = statsService.parseMonth(req.query.month);

  const lists = await statsService.getListsInRange(start, end);
  if (lists.length === 0) return res.json({ month: req.query.month, lists: [] });

  const items = await statsService.getItemsForLists(lists.map(l => l.id));
  const categoryMap = await statsService.getCategoryMap(items);
  const itemsGrouped = statsService.groupItemsByList(items);

  const result = lists.map(list => ({
    ...list,
    totalQuantity: (itemsGrouped[list.id] || []).length,
    categories: statsService.computeCategoriesBreakdown(itemsGrouped[list.id] || [], categoryMap),
  }));

  res.json({ month: req.query.month, lists: result });
});

/**
 * Retrieve statistics for a single list by its ID.
 *
 * HTTP Method: GET
 * Path: /api/statistics/list/:id
 *
 * URL Parameters:
 *   - id (number, required) → The ID of the list
 *
 * Response:
 *   200 OK
 *   {
 *     id: number,
 *     name: string,
 *     createdAt: string (ISO date),
 *     totalQuantity: number,
 *     categories: [
 *       {
 *         categoryId: number,
 *         categoryName: string,
 *         quantity: number,
 *         percent: number
 *       }
 *     ]
 *   }
 *
 * Errors:
 *   - 400 Bad Request → if the `id` parameter is not a valid number
 *   - 404 Not Found → if no list exists with the provided ID
 *
 * Behavior:
 *   - Retrieves the list from the database.
 *   - Retrieves all items associated with the list.
 *   - Computes category breakdown using `statsService`.
 */
export const getStatsByList = asyncHandler(async (req, res) => {
  const listId = Number(req.params.id);
  if (isNaN(listId)) throw Object.assign(new Error("listId must be a number"), { statusCode: 400 });

  const list = await prisma.list.findUnique({ where: { id: listId }, select: { id: true, name: true, createdAt: true } });
  if (!list) throw Object.assign(new Error("List not found"), { statusCode: 404 });

  const items = await prisma.item.findMany({ where: { listId }, select: { categoryId: true } });
  const categoryMap = await statsService.getCategoryMap(items);
  const categories = statsService.computeCategoriesBreakdown(items, categoryMap);

  res.json({ ...list, totalQuantity: items.length, categories });
});
