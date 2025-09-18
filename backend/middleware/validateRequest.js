/**
 * middleware/validateRequest.js
 * -----------------------------
 * Express middleware for validating incoming requests.
 *
 * This utility provides a reusable way to attach validation logic
 * to any route. It accepts a validation function and optionally
 * a data extractor, runs validation on the request data, and
 * automatically responds with HTTP 400 if validation fails.
 *
 * Usage example:
 *
 *   router.post(
 *     "/lists",
 *     validateRequest(validateListCreation, (req) => ({ name: req.body.name })),
 *     createShoppingList
 *   );
 *
 * Parameters:
 *   validator (Function) - A function that receives request data and returns an errors object.
 *   getData (Function)   - Optional function to extract the data to be validated (default: req.body).
 *
 * Behavior:
 *   - If the validator returns an object with errors, the request
 *     is rejected with status 400 and the errors in JSON format.
 *   - If no errors are found, the request continues to the next middleware/controller.
 */

export const validateRequest = (validator, getData) => {
  return (req, res, next) => {
    const data = getData ? getData(req) : req.body;
    const errors = validator(data);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};