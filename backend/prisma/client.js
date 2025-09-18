/**
 * client.js
 * -----------------------------
 * Prisma Client Singleton
 *
 * This file initializes and exports a single instance of PrismaClient
 * to be used across the entire application.
 *
 * Why?
 * - Prevents multiple PrismaClient instances from being created.
 * - Avoids exhausting database connections during development
 *   (since hot-reloading in frameworks like Next.js / Nodemon 
 *   may otherwise create new clients repeatedly).
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

/**
 * Global object trick:
 * - In development, we store the Prisma client instance in `globalThis`.
 * - This ensures that hot-reloading does not create multiple instances.
 * - In production, a new instance is created per application run.
 */
const globalForPrisma = globalThis;

/**
 * Prisma client instance
 * - Uses an existing global instance if available
 * - Otherwise creates a new PrismaClient
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error'], // Logs queries and errors to the console
  });

/**
 * Store the Prisma instance globally in non-production environments
 * (to prevent multiple connections during hot reloads).
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
