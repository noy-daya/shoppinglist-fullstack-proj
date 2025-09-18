/**
 * server.js
 * -----------------------------
 * Entry point of the Express server application.
 * Sets up middlewares, routes, and error handling.
 */

import express from 'express';
import cors from 'cors';

// Import route modules
import listRoutes from './routes/list.js';
import categoryRoutes from './routes/category.js';
import itemRoutes from './routes/item.js';
import unitRoutes from './routes/unit.js';
import statsRoutes from './routes/statistic.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/* ======================
   Middleware Setup
   ====================== */
app.use(cors());              // Enable Cross-Origin Resource Sharing
app.use(express.json());      // Parse incoming JSON requests

/* ======================
   API Routes
   ====================== */
app.use('/api/lists', listRoutes);          // Handles shopping lists
app.use('/api/categories', categoryRoutes); // Handles item categories
app.use('/api/items', itemRoutes);          // Handles individual items
app.use('/api/units', unitRoutes);          // Handles measurement units
app.use('/api/statistics', statsRoutes);    // Handles statistics and analytics

/* ======================
   Error Handling
   ====================== */
app.use(errorHandler); // Catches all errors thrown from controllers or async handlers.

/* ======================
   Server Startup
   ====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
