/**
 * validators/item.js
 * -----------------------------
 * Validation functions for "Item" entity.
 *
 * Both functions return an `errors` object:
 * - Key = field name
 * - Value = error message (string in Hebrew)
 *
 * If the `errors` object is empty, the input is considered valid.
 */

/* ======================
   Validate Item Addition
   ====================== */
/**
 * Validation for adding a new item.
 *
 * Rules:
 * - name: required, max 50 characters
 * - quantity: must be > 0
 * - brand: optional, max 50 characters
 * - unitId: required, must not be 0
 * - comments: optional, max 100 characters
 *
 * @param {Object} item - Item payload from request
 * @returns {Object} errors - Validation errors (Hebrew messages)
 */
export const validateItemAddition = (item) => {
  const errors = {};

  const name = item.name?.trim() || "";
  const brand = item.brand?.trim() || "";
  const comments = item.comments?.trim() || "";

  if (!name) {
    errors.name = "שדה חובה";
  } else if (name.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  if (
    item.quantity === 0 ||
    item.quantity === "0" ||
    item.quantity === "" ||
    item.quantity === null ||
    isNaN(item.quantity)
  ) {
    errors.quantity = "ערך השדה חייב להיות גדול מאפס";
  }

  if (brand && brand.length > 50) {
    errors.brand = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  if (!item.unitId || Number(item.unitId) === 0) {
    errors.unitId = "יש לבחור יחידת מידה";
  }

  if (comments && comments.length > 100) {
    errors.comments = "השדה יכול להכיל לכל היותר 100 תווים";
  }

  return errors;
};

/* ======================
   Validate Item Update
   ====================== */
/**
 * Validation for updating an existing item.
 *
 * Rules:
 * - name: required, max 50 characters
 * - quantity: must be > 0
 * - brand: optional, max 50 characters
 * - unitId: required, must not be 0
 * - comments: optional, max 100 characters
 *
 * @param {Object} item - Item payload from request
 * @returns {Object} errors - Validation errors (Hebrew messages)
 */
export const validateItemUpdate = (item) => {
  const errors = {};

  const name = item.name?.trim() || "";
  const brand = item.brand?.trim() || "";
  const comments = item.comments?.trim() || "";

  if (!name) {
    errors.name = "שדה חובה";
  } else if (name.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  if (
    item.quantity === 0 ||
    item.quantity === "0" ||
    item.quantity === "" ||
    item.quantity === null ||
    isNaN(item.quantity)
  ) {
    errors.quantity = "ערך השדה חייב להיות גדול מאפס";
  }

  if (brand && brand.length > 50) {
    errors.brand = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  if (!item.unitId || Number(item.unitId) === 0) {
    errors.unitId = "יש לבחור יחידת מידה";
  }

  if (comments && comments.length > 100) {
    errors.comments = "השדה יכול להכיל לכל היותר 100 תווים";
  }

  return errors;
};
