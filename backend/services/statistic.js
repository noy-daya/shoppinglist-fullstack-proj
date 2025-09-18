/**
 * services/statisticsService.js
 * -----------------------------
 * Service layer for statistics-related logic.
 * Handles computations for monthly and list statistics.
 */

import prisma from '../prisma/client.js';

/**
 * Validate and parse month string in YYYY-MM format
 * @param {string} monthStr
 * @returns {{ start: Date, end: Date }}
 * @throws {Error} 400 if month format is invalid
 */
export const parseMonth = (monthStr) => {
  if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
    throw Object.assign(new Error("Month must be in format YYYY-MM"), { statusCode: 400 });
  }
  const [yearStr, monthNumberStr] = monthStr.split("-");
  const year = Number(yearStr);
  const monthNumber = Number(monthNumberStr);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { start, end };
};

/**
 * Build a Map of categoryId -> categoryName
 * @param {Array<{ categoryId: number }>} items
 * @returns {Promise<Map<number, string>>}
 */
export const getCategoryMap = async (items) => {
  const categoryIds = [...new Set(items.map(i => i.categoryId))];
  if (categoryIds.length === 0) return new Map();

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });

  return new Map(categories.map(c => [c.id, c.name]));
};

/**
 * Compute category breakdown for a given array of items
 * @param {Array<{ categoryId: number }>} items
 * @param {Map<number, string>} categoryMap
 * @returns {Array<{ categoryId: number, categoryName: string, quantity: number, percent: number }>}
 */
export const computeCategoriesBreakdown = (items, categoryMap) => {
  const totalQuantity = items.length;
  const counts = items.reduce((acc, item) => {
    acc[item.categoryId] = (acc[item.categoryId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([catId, count]) => ({
    categoryId: Number(catId),
    categoryName: categoryMap.get(Number(catId)) || 'Unknown',
    quantity: count,
    percent: totalQuantity > 0 ? Number(((count / totalQuantity) * 100).toFixed(2)) : 0,
  })).sort((a, b) => b.quantity - a.quantity);
};

/**
 * Group items by listId
 * @param {Array<{ listId: number }>} items
 * @returns {Object} { listId: Array<items> }
 */
export const groupItemsByList = (items) => {
  return items.reduce((acc, item) => {
    const listItems = acc[item.listId] || [];
    listItems.push(item);
    acc[item.listId] = listItems;
    return acc;
  }, {});
};

/**
 * Fetch all lists created within a specific date range
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<Array<{ id: number, name: string, createdAt: Date }>>}
 */
export const getListsInRange = async (start, end) => {
  return prisma.list.findMany({
    where: { createdAt: { gte: start, lt: end } },
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
};

/**
 * Fetch items for given list IDs
 * @param {Array<number>} listIds
 * @returns {Promise<Array<{ listId: number, categoryId: number }>>}
 */
export const getItemsForLists = async (listIds) => {
  if (!listIds || listIds.length === 0) return [];
  return prisma.item.findMany({
    where: { listId: { in: listIds } },
    select: { listId: true, categoryId: true },
  });
};
