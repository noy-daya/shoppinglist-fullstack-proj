import { request } from "./http"; // standardized fetch helper
import { API_LISTS } from "../utils/constants";

/**
 * fetchLists
 *
 * Fetches all shopping lists from the API.
 *
 * @returns {Promise<Array>} - Array of list objects
 */
export const fetchLists = () => request(API_LISTS);

/**
 * createList
 *
 * Creates a new shopping list. If `name` is empty, generates a default name
 * using the current date in Hebrew locale.
 *
 * @param {string} name - Name of the new list
 * @returns {Promise<Object>} - Created list object
 */
export const createList = (name) => {
  let finalName = typeof name === "string" ? name.trim() : "";
  if (!finalName) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("he-IL");
    finalName = "רשימה מתאריך " + formattedDate;
  }
  return request(API_LISTS, {
    method: "POST",
    body: JSON.stringify({ name: finalName }),
  });
};

/**
 * updateList
 *
 * Updates an existing shopping list by its ID.
 *
 * @param {number|string} listId - ID of the list to update
 * @param {Object} payload - Fields to update (e.g., { name: "New Name" })
 * @returns {Promise<Object>} - Updated list object
 */
export const updateList = (listId, payload) =>
  request(`${API_LISTS}/${listId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

/**
 * deleteList
 *
 * Deletes a shopping list by its ID.
 *
 * @param {number|string} listId - ID of the list to delete
 * @returns {Promise<null>} - Returns null on success
 */
export const deleteList = (listId) =>
  request(`${API_LISTS}/${listId}`, {
    method: "DELETE",
  });