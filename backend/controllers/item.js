/**
 * controllers/item.js
 * -----------------------------
 * Controller functions for "Item" resource.
 *
 * Each function is wrapped with `asyncHandler` to forward errors
 * to the global error handler middleware.
 */

import prisma from '../prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Add an item to a specific list and category
 *
 * Method: POST
 * Path: /api/lists/:listId/categories/:categoryId/items
 *
 * Params:
 *   - listId (number, required)
 *   - categoryId (number, required)
 * Body:
 *   - name (string, required)
 *   - quantity (number, required)
 *   - brand (string, optional)
 *   - unitId (number, required)
 *   - comments (string, optional)
 *
 * Response:
 *   201: Created item object
 *   400: Missing required fields
 */
export const addItemToCategory = asyncHandler(async (req, res) => {
  const { listId, categoryId } = req.params;
  const { name, quantity, brand, unitId, comments } = req.body;

  if (!name || !quantity || !unitId) {
    throw Object.assign(new Error('Missing required fields: name, quantity or unitId'), { statusCode: 400 });
  }

  const newItem = await prisma.item.create({
    data: {
      name: name.trim(),
      quantity: Number(quantity),
      brand: brand?.trim() || null,
      unitId: Number(unitId),
      listId: Number(listId),
      categoryId: Number(categoryId),
      comments: comments?.trim() || null,
    },
  });

  res.status(201).json(newItem);
});

/**
 * Retrieve items by list and category
 *
 * Method: GET
 * Path: /api/lists/:listId/categories/:categoryId/items
 *
 * Params:
 *   - listId (number, required)
 *   - categoryId (number, required)
 * Query: none
 * Body: none
 *
 * Response:
 *   200: Array of item objects including unit details
 */
export const getItemsByListAndCategory = asyncHandler(async (req, res) => {
  const { listId, categoryId } = req.params;

  const items = await prisma.item.findMany({
    where: { listId: Number(listId), categoryId: Number(categoryId) },
    include: { unit: true },
    orderBy: { name: 'asc' },
  });

  res.status(200).json(items);
});

/**
 * Update an existing item
 *
 * Method: PUT
 * Path: /api/items/:id
 *
 * Params:
 *   - id (number, required)
 * Body:
 *   - name, quantity, brand, unitId, comments, bought (all optional)
 *
 * Response:
 *   200: Updated item object
 *   400: Invalid ID or no valid fields provided
 */
export const updateItem = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw Object.assign(new Error('Invalid item ID'), { statusCode: 400 });

  const { name, quantity, brand, unitId, comments, bought } = req.body;
  const dataToUpdate = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (quantity !== undefined) dataToUpdate.quantity = quantity;
  if (brand !== undefined) dataToUpdate.brand = brand;
  if (unitId !== undefined) dataToUpdate.unitId = unitId;
  if (comments !== undefined) dataToUpdate.comments = comments;
  if (bought !== undefined) dataToUpdate.bought = bought;

  if (Object.keys(dataToUpdate).length === 0) {
    throw Object.assign(new Error('No valid fields provided to update'), { statusCode: 400 });
  }

  const updatedItem = await prisma.item.update({ where: { id }, data: dataToUpdate });
  res.status(200).json(updatedItem);
});

/**
 * Update the "bought" status of an item
 *
 * Method: PATCH
 * Path: /api/items/:id
 *
 * Params:
 *   - id (number, required)
 * Body:
 *   - bought (boolean, required)
 *
 * Response:
 *   200: Updated item object
 *   400: Invalid ID or invalid bought value
 */
export const updateBoughtStatus = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { bought } = req.body;

  if (isNaN(id)) throw Object.assign(new Error('Invalid item ID'), { statusCode: 400 });
  if (typeof bought !== 'boolean') throw Object.assign(new Error("'bought' must be boolean"), { statusCode: 400 });

  const updatedItem = await prisma.item.update({ where: { id }, data: { bought } });
  res.status(200).json(updatedItem);
});

/**
 * Delete an item
 *
 * Method: DELETE
 * Path: /api/items/:id
 *
 * Params:
 *   - id (number, required)
 *
 * Response:
 *   204: Deleted successfully
 *   400: Invalid ID
 */
export const deleteItem = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw Object.assign(new Error('Invalid item ID'), { statusCode: 400 });

  await prisma.item.delete({ where: { id } });
  res.sendStatus(204);
});
