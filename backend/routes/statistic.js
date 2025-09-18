/**
 * routes/statistic.js
 * -----------------------------
 * Express router for handling "Statistics" endpoints.
 *
 * Base path: /api/statistics
 *
 * Routes:
 * - GET /api/statistics/monthly      → Retrieve monthly statistics of all lists in a specific month
 * - GET /api/statistics/list/:id     → Retrieve statistics for a specific list
 */

import express from 'express';
import * as statisticController from '../controllers/statistic.js';

const router = express.Router();

/* ======================
   Statistics Routes
   ====================== */

/**
 * Retrieve monthly statistics
 * Method: GET
 * Full path: /api/statistics/monthly
 *
 * Query:
 *   - month (string, required, format YYYY-MM)
 */
router.get("/monthly", statisticController.getMonthlyStats);

/**
 * Retrieve statistics for a specific list by ID
 * Method: GET
 * Full path: /api/statistics/list/:id
 *
 * Params:
 *   - id: list ID
 */
router.get("/list/:id", statisticController.getStatsByList);

export default router;
