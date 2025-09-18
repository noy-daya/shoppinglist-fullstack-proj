// React
import { motion } from "framer-motion";

/**
 * CategoryLegend
 * 
 * Displays a vertical list of categories with color indicators.
 * Supports highlighting a selected category and mobile popup mode.
 *
 * Props:
 * - categories: array of objects { categoryId, categoryName, quantity }
 * - categoryColorMap: object mapping categoryId -> color string
 * - highlightCategoryId: number|string, the currently highlighted category ID
 * - onCategoryClick: function, called when a category button is clicked
 * - isMobilePopup: boolean, optional, if true the legend adapts to mobile popup style
 *
 * Features:
 * - Highlights the currently selected category
 * - Responsive styling for mobile popup vs desktop sidebar
 */
export default function CategoryLegend({
  categories,
  categoryColorMap,
  highlightCategoryId,
  onCategoryClick,
  isMobilePopup = false
}) {
  return (
    <aside
      className={`flex flex-col gap-1 ${
        !isMobilePopup
          ? "p-5 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-sky-100 max-h-[450px] overflow-y-auto"
          : "flex-1 p-5 overflow-y-auto"
      }`}
    >
      {/* Title for desktop view */}
      {!isMobilePopup && <h3 className="font-bold text-sky-600 text-lg mb-2">קטגוריות</h3>}

      {/* List of categories */}
      {categories.map((c) => (
        <motion.button
          key={c.categoryId}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onCategoryClick(c.categoryId)}
          className={`flex items-center gap-3 w-full min-w-0 px-3 py-2 rounded-xl font-huninn transition-all duration-200 select-none cursor-pointer ${
            highlightCategoryId === c.categoryId
              ? "bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md"
              : "bg-white/60 hover:bg-sky-100 hover:text-sky-800 text-gray-700"
          }`}
        >
          {/* Color indicator */}
          <span
            className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
            style={{ backgroundColor: categoryColorMap[c.categoryId] }}
          ></span>

          {/* Category name and item count */}
          <span className="truncate overflow-hidden">{c.categoryName} ({c.quantity})</span>
        </motion.button>
      ))}
    </aside>
  );
}