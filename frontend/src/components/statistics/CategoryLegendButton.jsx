import { useState } from "react";

// Animations & Icons
import { motion, AnimatePresence } from "framer-motion";
import { SquareMenu, X } from "lucide-react";

// Components
import CategoryLegend from "./CategoryLegend";

/**
 * CategoryLegendButton
 *
 * A floating mobile button that opens a popup displaying the category legend.
 * Ensures consistency with the desktop chart by using the same color mapping.
 *
 * Props:
 * - listId (number|string): ID of the current list.
 * - listData (object): The list data containing categories.
 * - categoryColorMap (object): Mapping of categoryId → color, used to color the circles.
 * - highlightCategoryId (number|string|null): The currently highlighted category.
 * - setHighlightCategoryId (function): Setter function for updating highlighted category.
 * - navigate (function): react-router-dom navigation function.
 *
 * Behavior:
 * - Clicking the floating button opens a modal with the category legend.
 * - Selecting a category navigates to the items page for that category and closes the popup.
 * - Clicking outside the popup or the close button dismisses the modal.
 */
export default function CategoryLegendButton({
  listId,
  listData,
  categoryColorMap,
  highlightCategoryId,
  setHighlightCategoryId,
  navigate
}) {
  const [showLegendMobile, setShowLegendMobile] = useState(false);

  return (
    <>
      {/* Floating mobile button */}
      <button
        className="
          md:hidden fixed bottom-6 right-6 z-50
          w-12 h-12 flex items-center justify-center
          bg-sky-500 hover:bg-sky-600 text-white
          rounded-full shadow-lg
          transition-all duration-200
          active:scale-95 cursor-pointer
        "
        onClick={() => setShowLegendMobile(true)}
        aria-label="הצג קטגוריות"
      >
        <SquareMenu size={24} />
      </button>

      {/* Mobile legend popup */}
      <AnimatePresence>
        {showLegendMobile && (
          <>
            {/* Overlay background */}
            <motion.div
              className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegendMobile(false)}
            />

            {/* Popup container */}
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm max-h-[70vh] flex flex-col gap-2 overflow-y-auto p-4">
                
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sky-600 text-lg">קטגוריות</h3>
                  <button
                    onClick={() => setShowLegendMobile(false)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Category legend component */}
                <CategoryLegend
                  categories={listData.categories}
                  categoryColorMap={categoryColorMap} // Colored circles match desktop
                  highlightCategoryId={highlightCategoryId}
                  onCategoryClick={(categoryId) => {
                    navigate(`/items-page/${listId}`, {
                      state: { list: listData, selectedCategoryId: categoryId },
                    });
                    setShowLegendMobile(false);
                  }}
                  isMobilePopup={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}