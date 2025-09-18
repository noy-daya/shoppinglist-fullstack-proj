/**
 * routes/list.js
 * -----------------------------
 * Express router for handling "List" resource endpoints.
 *
 * Base path: /api/lists
 *
 * Routes:
 * - POST   /api/lists                              → Create a new list
 * - GET    /api/lists                              → Retrieve all lists
 * - PUT    /api/lists/:id                          → Update list name
 * - DELETE /api/lists/:id                          → Delete a list and its items
 * - POST   /api/lists/:listId/categories/:categoryId/items → Add item to list/category
 * - GET    /api/lists/:listId/categories/:categoryId/items → Get items by list and category
 */

import express from 'express';
import * as listController from '../controllers/list.js';
import * as itemController from '../controllers/item.js';
import { validateListCreation, validateListUpdate } from "../validators/list.js";
import { validateItemAddition } from "../validators/item.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/* ======================
   List Routes
   ====================== */

/**
 * Create a new list
 */
router.post(
  "/",
  validateRequest(validateListCreation, (req) => ({ name: req.body.name })),
  listController.createList
);

/**
 * Retrieve all lists
 */
router.get("/", listController.getAllLists);

/**
 * Update list name
 */
router.put(
  "/:id",
  validateRequest(validateListUpdate, (req) => ({ name: req.body.name })),
  listController.updateListName
);

/**
 * Delete a list
 */
router.delete("/:id", listController.deleteList);

/* ======================
   Items within List/Category
   ====================== */

/**
 * Add an item to a specific list/category
 */
router.post(
  "/:listId/categories/:categoryId/items",
  validateRequest(validateItemAddition, (req) => ({
    name: req.body.name,
    quantity: req.body.quantity,
    brand: req.body.brand,
    unitId: req.body.unitId,
    comments: req.body.comments,
  })),
  itemController.addItemToCategory
);

/**
 * Get items by list and category
 */
router.get(
  "/:listId/categories/:categoryId/items",
  itemController.getItemsByListAndCategory
);

export default router;
