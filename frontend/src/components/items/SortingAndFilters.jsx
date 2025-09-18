// React
import { motion } from "framer-motion";

// Components
import CustomSearchInput from "../common/CustomSearchInput";

/**
 * SortingAndFilters
 * Component for sorting, filtering, and searching items within a category.
 *
 * Features:
 * - Sort items by name (ascending/descending)
 * - Filter by bought/not bought
 * - Search items by name
 *
 * Props:
 * - nameOrderAsc: Boolean, whether sorting by name is ascending
 * - setNameOrderAsc: Function to toggle name sorting order
 * - showBought: Boolean, whether to show bought items
 * - setShowBought: Function to toggle showing bought items
 * - showNotBought: Boolean, whether to show not bought items
 * - setShowNotBought: Function to toggle showing not bought items
 * - searchTerm: String, current search term
 * - setSearchTerm: Function to update search term
 * - currentCategoryId: ID of the currently selected category (if none, component renders null)
 */
export default function SortingAndFilters({
  nameOrderAsc,
  setNameOrderAsc,
  showBought,
  setShowBought,
  showNotBought,
  setShowNotBought,
  searchTerm,
  setSearchTerm,
  currentCategoryId,
}) {
  if (!currentCategoryId) return null;

  return (
    <div className="mb-6 bg-white/80 rounded-2xl shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all">
      
      {/* Sorting & Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort by Name */}
        <motion.button
          onClick={() => setNameOrderAsc(prev => !prev)}
          className="bg-white/20 cursor-pointer rounded-full border-2 border-sky-500 text-sky-500 p-1 flex items-center gap-1 px-4 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          שם {nameOrderAsc ? "↑" : "↓"}
        </motion.button>

        {/* Show Bought Items */}
        <motion.button
          onClick={() => setShowBought(prev => !prev)}
          className={`cursor-pointer rounded-full border-2 p-1 flex items-center gap-1 px-4 transition-colors duration-200 ${
            showBought
              ? "bg-white/20 border-sky-500 text-sky-500"
              : "border-sky-700/30 text-sky-700/30 bg-transparent"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          נקנה
        </motion.button>

        {/* Show Not Bought Items */}
        <motion.button
          onClick={() => setShowNotBought(prev => !prev)}
          className={`cursor-pointer rounded-full border-2 p-1 flex items-center gap-1 px-4 transition-colors duration-200 ${
            showNotBought
              ? "bg-white/20 border-sky-500 text-sky-500"
              : "border-sky-700/30 text-sky-700/30 bg-transparent"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          לא נקנה
        </motion.button>
      </div>

      {/* Search Input */}
      <div className="flex-1 min-w-[200px] md:max-w-xs">
        <CustomSearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="חפש מוצר בקטגוריה זו..."
        />
      </div>
    </div>
  );
}