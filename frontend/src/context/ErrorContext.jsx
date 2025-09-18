// context/ErrorContext.js

/**
 * ErrorContext.js
 *
 * React context for global error and success handling.
 * Provides an easy way to show toast notifications across the app.
 *
 * Features:
 * - Wraps the app in an `ErrorProvider` to expose error/success handlers.
 * - Normalizes errors using `createError` from utils/errors.js.
 * - Uses `react-hot-toast` for user-friendly notifications.
 */

import React, { createContext, useContext } from "react";
import toast from "react-hot-toast"; // Library for toast alerts
import { createError } from "../utils/errors"; // module for standardized error handling across the application

// --- context creation ---
const ErrorContext = createContext();

/**
 * ErrorProvider
 * Wraps the app and provides error/success handlers via React context.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render.
 *
 * Provides:
 * - `showError(err)` → Normalizes error via `createError` and shows toast.error.
 * - `showSuccess(msg)` → Shows success message via toast.success.
 *
 * @example
 * <ErrorProvider>
 *   <App />
 * </ErrorProvider>
 */
export function ErrorProvider({ children }) {
  /**
   * Show an error notification
   * @param {Error|AppError|any} err - Error object to normalize & display
   */
  const showError = (err) => {
    const error = createError(err);
    toast.error(error.message);
  };

  /**
   * Show a success notification
   * @param {string} msg - Success message to display
   */
  const showSuccess = (msg) => {
    toast.success(msg);
  };

  return (
    <ErrorContext.Provider value={{ showError, showSuccess }}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * useErrorHandler
 * Custom hook to access the error/success handlers.
 *
 * @returns {{ showError: Function, showSuccess: Function }}
 *
 * @example
 * const { showError, showSuccess } = useErrorHandler();
 * try {
 *   await apiCall();
 *   showSuccess("בוצע בהצלחה");
 * } catch (err) {
 *   showError(err);
 * }
 */
export function useErrorHandler() {
  return useContext(ErrorContext);
}