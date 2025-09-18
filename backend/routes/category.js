/**
 * routes/category.js
 * -----------------------------
 * Express router for handling "Category" resource endpoints.
 *
 * Base path: /api/categories
 *
 * Routes:
 * - POST   /api/categories     → Create a new category
 * - GET    /api/categories     → Retrieve all categories
 * - DELETE /api/categories/:id → Delete a category by ID
 */

import express from 'express';
import * as categoryController from '../controllers/category.js';

const router = express.Router();

/* ======================
   Category Routes
   ====================== */

/**
 * Create a new category
 * Method: POST
 * Full path: /api/categories
 */
router.post("/", categoryController.createCategory);

/**
 * Retrieve all categories
 * Method: GET
 * Full path: /api/categories
 */
router.get("/", categoryController.getAllCategories);

/**
 * Delete a category by ID
 * Method: DELETE
 * Full path: /api/categories/:id
 * Params:
 *   - id: category ID
 */
router.delete("/:id", categoryController.deleteCategory);

export default router;
