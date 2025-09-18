/**
 * validators/listValidators.js
 * -----------------------------
 * Validation functions for "List" entity.
 *
 * Both functions return an `errors` object:
 * - Key = field name
 * - Value = error message (string in Hebrew)
 *
 * If the `errors` object is empty, the input is considered valid.
 */

/* ======================
   Validate List Creation
   ====================== */
/**
 * Validation for creating a new list.
 *
 * Rules:
 * - name: optional, but if provided → min 3 chars, max 50 chars
 *
 * @param {Object} data - Payload containing list fields
 * @param {string} data.name - Name of the list
 * @returns {Object} errors - Validation errors (Hebrew messages)
 */
export const validateListCreation = ({ name }) => {
  const errors = {};
  const trimmedName = name?.trim() || "";

  if (trimmedName) {
    if (trimmedName.length < 3) {
      errors.name = "השדה חייב להכיל לפחות 3 תווים";
    } else if (trimmedName.length > 50) {
      errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
    }
  }

  return errors;
};

/* ======================
   Validate List Update
   ====================== */
/**
 * Validation for updating an existing list.
 *
 * Rules:
 * - name: required, min 3 chars, max 50 chars
 *
 * @param {Object} data - Payload containing list fields
 * @param {string} data.name - Updated name of the list
 * @returns {Object} errors - Validation errors (Hebrew messages)
 */
export const validateListUpdate = ({ name }) => {
  const errors = {};
  const trimmedName = name?.trim() || "";

  if (!trimmedName) {
    errors.name = "השדה לא יכול להיות ריק";
  } else if (trimmedName.length < 3) {
    errors.name = "השדה חייב להכיל לפחות 3 תווים";
  } else if (trimmedName.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  return errors;
};