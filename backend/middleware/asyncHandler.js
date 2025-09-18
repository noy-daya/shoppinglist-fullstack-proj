/**
 * middleware/asyncHandler.js
 * -----------------------------
 * Wrap asynchronous route handlers to automatically forward errors
 * to the global error handler middleware.
 *
 * Usage:
 *   router.get("/items", asyncHandler(async (req, res) => {
 *     const items = await getItems();
 *     res.json(items);
 *   }));
 *
 * Parameters:
 *   fn (Function) - Async route handler (req, res, next)
 *
 * Returns:
 *   Function - Wrapped route handler with automatic error forwarding
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};