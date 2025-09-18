/**
 * seed.js
 * -----------------------------
 * Database seeding script for Prisma.
 *
 * This script populates the database with:
 * - Default categories
 * - Common measurement units
 *
 * Uses Prisma's `upsert` method to ensure:
 * - Records are created if they do not exist
 * - Existing records are updated (avoiding duplicates)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* ======================
   Seed Categories
   ====================== */
/**
 * Seeds the "Category" table with default categories.
 *
 * - Each category has a `name` and optional `iconName`
 * - Uses upsert to avoid duplicate entries
 *
 * @returns {Promise<void>}
 */
async function seedCategories() {
  const categories = [
    { name: 'פירות וירקות', iconName: 'Carrot' },
    { name: 'מוצרי חלב וביצים', iconName: 'Milk' },
    { name: 'קטניות ומוצרי יסוד', iconName: 'Bean' },
    { name: 'בשר ועוף', iconName: 'Beef' },
    { name: 'דגים', iconName: 'Fish' },
    { name: 'קפואים', iconName: 'Snowflake' },
    { name: 'סלטים מוכנים', iconName: 'Salad' },
    { name: 'מוצרי אפייה', iconName: 'Croissant' },
    { name: 'ממרחים ורטבים', iconName: 'Sandwich' },
    { name: 'תבלינים וגרעינים', iconName: 'Sprout' },
    { name: 'שימורים', iconName: 'Cylinder' },
    { name: 'משקאות', iconName: 'Coffee' },
    { name: 'לחמים, עוגות ועוגיות', iconName: 'CakeSlice' },
    { name: 'ממתקים וחטיפים', iconName: 'Lollipop' },
    { name: 'הגיינה וטיפוח', iconName: 'Bath' },
    { name: 'ניקיון', iconName: 'BrushCleaning' },
    { name: 'אחר', iconName: 'Package' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { iconName: category.iconName }, // Update icon if exists
      create: category,                        // Create new category if not exists
    });
  }

  console.log('✅ Categories seeded successfully');
}

/* ======================
   Seed Units
   ====================== */
/**
 * Seeds the "Unit" table with common measurement units.
 *
 * - Each unit has a unique `name`
 * - Uses upsert to avoid duplicate entries
 *
 * @returns {Promise<void>}
 */
async function seedUnits() {
  const units = [
    { name: 'יחידה' },
    { name: 'גרם' },
    { name: 'ק"ג' },
    { name: 'ליטר' },
    { name: 'מיליליטר' },
    { name: 'חבילה' },
    { name: 'בקבוק' },
    { name: 'קופסה' },
    { name: 'שקית' },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: {},        // No updates required for units
      create: unit,      // Create new unit if not exists
    });
  }

  console.log('✅ Units seeded successfully');
}

/* ======================
   Main Seeder Runner
   ====================== */
/**
 * Main entry point for the database seeding process.
 * Runs all individual seed functions.
 *
 * @returns {Promise<void>}
 */
async function main() {
  await seedCategories();
  await seedUnits();
}

// Run the seeding process
main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });