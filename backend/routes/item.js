/**
 * routes/item.js
 * -----------------------------
 * Express router for handling "Item" resource endpoints.
 *
 * Base path: /api/items
 *
 * Routes:
 * - PUT    /:id    → Update an existing item
 * - PATCH  /:id    → Update the "bought" status of an item
 * - DELETE /:id    → Delete an item
 */

import express from "express";
import * as itemController from "../controllers/item.js";
import { validateItemUpdate } from "../validators/item.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/* ======================
   Item Routes
   ====================== */

/**
 * Update an existing item
 */
router.put(
  "/:id",
  validateRequest(validateItemUpdate, (req) => ({
    name: req.body.name,
    quantity: req.body.quantity,
    brand: req.body.brand,
    unitId: req.body.unitId,
    comments: req.body.comments,
  })),
  itemController.updateItem
);

/**
 * Update the "bought" status of an item
 */
router.patch("/:id", itemController.updateBoughtStatus);

/**
 * Delete an item
 */
router.delete("/:id", itemController.deleteItem);

export default router;
