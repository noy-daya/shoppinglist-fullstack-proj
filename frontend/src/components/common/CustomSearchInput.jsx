import React from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CustomSearchInput
 * Controlled search input with a search icon and clear button.
 *
 * Props:
 * - value: input value
 * - onChange: callback for input changes
 * - placeholder: input placeholder text
 */
export default function CustomSearchInput({ value, onChange, placeholder = "חפש מוצר..." }) {
  const handleChange = (e) => onChange(e.target.value);
  const handleClear = () => onChange("");

  return (
    <div className="relative w-full max-w-md">
      {/* Search icon */}
      <span className="absolute inset-y-0 right-3 flex items-center text-sky-400 pointer-events-none">
        <Search className="w-5 h-5" />
      </span>

      {/* Input */}
      <input
        name="search"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-sky-400 text-sky-400 pl-4 pr-10 py-2 placeholder-sky-700/30
                   focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-300/30
                   transition-all duration-200"
      />

      {/* Clear button */}
      <AnimatePresence>
        {value && (
          <motion.button
            onClick={handleClear}
            type="button"
            className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-gray-600"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
