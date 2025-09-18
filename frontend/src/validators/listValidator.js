/**
 * listValidator.js
 * 
 * Utility functions to validate shopping list names for creation or update.
 * Error messages are returned.
 */

/**
 * validateListCreation
 * Validates a list name when creating a new list.
 * The name can be empty, but if provided, must meet length requirements.
 *
 * @param {string} name - The name of the list to validate
 * @returns {Object} errors - An object mapping field names to Hebrew error messages
 */
export const validateListCreation = (name) => {
  const errors = {};
  const trimmedName = name?.trim() || "";

  // Empty value is allowed. If provided, it must be between 3 and 50 characters.
  if (trimmedName.length > 0) {
    if (trimmedName.length < 3) {
      errors.name = "השדה חייב להכיל לפחות 3 תווים";
    } else if (trimmedName.length > 50) {
      errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
    }
  }

  return errors;
};

/**
 * validateListUpdate
 * Validates a list name when updating an existing list.
 * The name is required and must meet length requirements.
 *
 * @param {Object} list - The list object to validate
 * @param {string} list.name - Name of the list
 * @returns {Object} errors - An object mapping field names to Hebrew error messages
 */
export const validateListUpdate = (list) => {
  const errors = {};
  const name = list.name?.trim() || "";

  // Name is required: must be between 3 and 50 characters
  if (!name) {
    errors.name = "השדה לא יכול להיות ריק";
  } else if (name.length < 3) {
    errors.name = "השדה חייב להכיל לפחות 3 תווים";
  } else if (name.length > 50) {
    errors.name = "השדה יכול להכיל לכל היותר 50 תווים";
  }

  return errors;
};