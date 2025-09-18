/**
 * itemValidator.js
 * 
 * Utility functions to validate item objects for addition or update.
 * Error messages are returned.
 */

/**
 * validateItemAddition
 * Validates the fields of an item before adding it to a list.
 *
 * @param {Object} item - The item to validate
 * @param {string} item.name - Item name
 * @param {string} [item.brand] - Item brand (optional)
 * @param {number|string} item.quantity - Item quantity
 * @param {number} item.unitId - Unit ID
 * @param {string} [item.comments] - Optional comments
 * @returns {Object} errors - An object mapping field names to Hebrew error messages
 */
export function validateItemAddition(item) {
  const errors = {};

  // Trim string fields
  const name = item.name?.trim() || "";
  const brand = item.brand?.trim() || "";
  const comments = item.comments?.trim() || "";

  // Name: required and max 50 chars
  if (!name) {
    errors.name = "שדה חובה";
  } else if (name.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  // Quantity: must be greater than zero
  if (item.quantity === "0" || item.quantity === "" || item.quantity === null) {
    errors.quantity = "ערך השדה חייב להיות גדול מאפס";
  }

  // Brand: optional, max 50 chars
  if (brand && brand.length > 50) {
    errors.brand = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  // Unit ID: required, must not be 0
  if (!item.unitId || Number(item.unitId) === 0) {
    errors.unitId = "יש לבחור יחידת מידה";
  }

  // Comments: optional, max 100 chars
  if (comments && comments.length > 100) {
    errors.comments = "השדה יכול להכיל לכל היותר 100 תווים";
  }

  return errors;
}

/**
 * validateItemUpdate
 * Validates the fields of an item before updating it in a list.
 * Same rules as validateItemAddition.
 *
 * @param {Object} item - The item to validate
 * @param {string} item.name - Item name
 * @param {string} [item.brand] - Item brand (optional)
 * @param {number|string} item.quantity - Item quantity
 * @param {number} item.unitId - Unit ID
 * @param {string} [item.comments] - Optional comments
 * @returns {Object} errors - An object mapping field names to Hebrew error messages
 */
export function validateItemUpdate(item) {
  const errors = {};

  // Trim string fields
  const name = item.name?.trim() || "";
  const brand = item.brand?.trim() || "";
  const comments = item.comments?.trim() || "";

  // Name: required and max 50 chars
  if (!name) {
    errors.name = "שדה חובה";
  } else if (name.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  // Quantity: must be greater than zero
  if (item.quantity === 0 || item.quantity === "0" || item.quantity === "" || item.quantity === null) {
    errors.quantity = "ערך השדה חייב להיות גדול מאפס";
  }

  // Brand: optional, max 50 chars
  if (brand && brand.length > 50) {
    errors.brand = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  // Unit ID: required, must not be 0
  if (!item.unitId || Number(item.unitId) === 0) {
    errors.unitId = "יש לבחור יחידת מידה";
  }

  // Comments: optional, max 100 chars
  if (comments && comments.length > 100) {
    errors.comments = "השדה יכול להכיל לכל היותר 100 תווים";
  }

  return errors;
}