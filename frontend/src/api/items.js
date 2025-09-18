import { request } from "./http"; // standardized fetch helper
import { API_ITEMS, API_LISTS } from "../utils/constants";

/**
 * fetchItems
 *
 * Fetches sorted items array for a specific list and category.
 *
 * @param {number|string} listId - ID of the list
 * @param {number|string} categoryId - ID of the category
 * @param {string} [sortBy="name"] - Field to sort by (default: "name")
 * @param {string} [order="asc"] - Sort order: "asc" or "desc"
 * @returns {Promise<Array>} - Array of item objects
 */
export const fetchItems = (listId, categoryId, sortBy = "name", order = "asc") =>
  request(`${API_LISTS}/${listId}/categories/${categoryId}/items?sortBy=${sortBy}&order=${order}`);

/**
 * addItem
 *
 * Adds a new item to a specific list and category.
 *
 * @param {number|string} listId - ID of the list
 * @param {number|string} categoryId - ID of the category
 * @param {Object} item - Item payload
 * @returns {Promise<Object>} - Created item
 */
export const addItem = (listId, categoryId, item) =>
  request(`${API_LISTS}/${listId}/categories/${categoryId}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });

/**
 * updateItem
 *
 * Updates an existing item entirely.
 *
 * @param {number|string} itemId - ID of the item to update
 * @param {Object} item - Full item payload
 * @returns {Promise<Object>} - Updated item
 */
export const updateItem = (itemId, item) =>
  request(`${API_ITEMS}/${itemId}`, { method: "PUT", body: JSON.stringify(item) });

/**
 * patchItem
 *
 * Partially updates an existing item (only fields provided in `patch`).
 *
 * @param {number|string} itemId - ID of the item to update
 * @param {Object} patch - Partial fields to update
 * @returns {Promise<Object>} - Updated item
 */
export const patchItem = (itemId, patch) =>
  request(`${API_ITEMS}/${itemId}`, { method: "PATCH", body: JSON.stringify(patch) });

/**
 * deleteItem
 *
 * Deletes an item by its ID.
 *
 * @param {number|string} itemId - ID of the item to delete
 * @returns {Promise<null>} - Returns null on success
 */
export const deleteItem = (itemId) =>
  request(`${API_ITEMS}/${itemId}`, { method: "DELETE" });