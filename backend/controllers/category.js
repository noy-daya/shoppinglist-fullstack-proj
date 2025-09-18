/**
 * controllers/category.js
 * -----------------------------
 * Controller functions for "Category" resource.
 *
 * Each function is wrapped with `asyncHandler` to automatically
 * forward errors to the global error handler middleware.
 */

import prisma from '../prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Create a new category
 *
 * HTTP Method: POST
 * Path: /api/categories
 * 
 * Params: none
 * Query: none
 * Body:
 *   - name (string, required)
 *   - iconName (string, optional)
 *
 * Response:
 *   201: Created category object { id, name, iconName }
 *   400: Name is missing
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, iconName } = req.body;
  if (!name) throw Object.assign(new Error('Name is required'), { statusCode: 400 });

  const category = await prisma.category.create({ data: { name, iconName } });
  res.status(201).json(category);
});

/**
 * Delete a category by ID
 *
 * HTTP Method: DELETE
 * Path: /api/categories/:id
 * 
 * Params:
 *   - id (number, required)
 * Query: none
 * Body: none
 *
 * Response:
 *   204: No content (deleted successfully)
 *   400: Invalid ID
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw Object.assign(new Error('Invalid category ID'), { statusCode: 400 });

  await prisma.category.delete({ where: { id } });
  res.sendStatus(204);
});

/**
 * Retrieve all categories
 *
 * HTTP Method: GET
 * Path: /api/categories
 * 
 * Params: none
 * Query: none
 * Body: none
 *
 * Response:
 *   200: Array of categories [{ id, name, iconName }]
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
});
