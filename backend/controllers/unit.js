/**
 * controllers/unit.js
 * -----------------------------
 * Controller functions for "Unit" resource.
 *
 * Each function is wrapped with `asyncHandler` to automatically
 * forward errors to the global error handler middleware.
 */

import prisma from '../prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Retrieve all measurement units
 *
 * HTTP Method: GET
 * Path: /api/units
 * 
 * Params: none
 * Query: none
 * Body: none
 *
 * Response:
 *   200: Array of units [{ id, name }]
 */
export const getAllUnits = asyncHandler(async (req, res) => {
  const units = await prisma.unit.findMany();
  res.status(200).json(units);
});
