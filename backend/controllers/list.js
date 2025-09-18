/**
 * controllers/list.js
 * -----------------------------
 * Controller functions for "List" resource.
 *
 * Each function is wrapped with `asyncHandler` to automatically
 * forward errors to the global error handler middleware.
 */

import prisma from '../prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Create a new list
 *
 * Method: POST
 * Path: /api/lists
 *
 * Params: none
 * Query: none
 * Body:
 *   - name (string, required)
 *
 * Response:
 *   201: Created list object { id, name, createdAt }
 *   400: Name is missing
 */
export const createList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw Object.assign(new Error('Name is required'), { statusCode: 400 });

  const newList = await prisma.list.create({ data: { name } });
  res.status(201).json(newList);
});

/**
 * Retrieve all lists
 *
 * Method: GET
 * Path: /api/lists
 *
 * Params: none
 * Query: none
 * Body: none
 *
 * Response:
 *   200: Array of lists [{ id, name, createdAt }]
 */
export const getAllLists = asyncHandler(async (req, res) => {
  const lists = await prisma.list.findMany({ orderBy: { createdAt: 'desc' } });
  res.status(200).json(lists);
});

/**
 * Update list name
 *
 * Method: PUT
 * Path: /api/lists/:id
 *
 * Params:
 *   - id (number, required) → list ID
 * Query: none
 * Body:
 *   - name (string, required)
 *
 * Response:
 *   200: Updated list object { id, name, createdAt }
 *   400: Invalid ID or missing name
 */
export const updateListName = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw Object.assign(new Error('Invalid list ID'), { statusCode: 400 });

  const { name } = req.body;
  if (!name) throw Object.assign(new Error('Name is required'), { statusCode: 400 });

  const updatedList = await prisma.list.update({ where: { id }, data: { name } });
  res.status(200).json(updatedList);
});

/**
 * Delete a list and its related items
 *
 * Method: DELETE
 * Path: /api/lists/:id
 *
 * Params:
 *   - id (number, required) → list ID
 * Query: none
 * Body: none
 *
 * Response:
 *   204: Deleted successfully
 *   400: Invalid ID
 */
export const deleteList = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw Object.assign(new Error('Invalid list ID'), { statusCode: 400 });

  await prisma.item.deleteMany({ where: { listId: id } });
  await prisma.list.delete({ where: { id } });

  res.sendStatus(204);
});
