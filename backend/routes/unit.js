/**
 * routes/unit.js
 * -----------------------------
 * Express router for handling "Unit" resource endpoints.
 *
 * Base path: /api/units
 *
 * Routes:
 * - GET /api/units → Retrieve all measurement units
 */

import express from 'express';
import * as unitController from '../controllers/unit.js';

const router = express.Router();

/* ======================
   Unit Routes
   ====================== */

/**
 * Retrieve all units
 * Method: GET
 * Full path: /api/units
 *
 * Params: none
 * Query: none
 * Body: none
 */
router.get("/", unitController.getAllUnits);

export default router;