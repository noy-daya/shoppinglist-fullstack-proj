// React
import { useState, useEffect } from "react";

// Animations & Icons
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

// Components
import ListChart from "./ListChart"; // Displays chart for a single list

/**
 * Carousel
 * A horizontal carousel for displaying multiple lists' charts.
 *
 * Props:
 * - month: string, currently selected month (YYYY-MM)
 * - selectedListId: string | number, optional list ID to filter the carousel
 * - lists: array, all available lists
 * - dataByList: object, mapping of list ID to statistics data
 *
 * Features:
 * - Supports navigation between lists with left/right buttons
 * - Automatically adjusts to the selected list or shows all lists
 * - Smooth enter/exit animations for charts
 * - Handles edge cases like empty lists or removed lists
 */
export default function Carousel({ month, selectedListId: propListId, lists, dataByList }) {
  // Current carousel index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Currently selected list ID (may be filtered externally via props)
  const [selectedListId, setSelectedListId] = useState(propListId || null);

  // Sync with external selectedListId changes
  useEffect(() => {
    setSelectedListId(propListId || null);
  }, [propListId]);

  // Determine which lists to show based on selected list
  const listsToShow = selectedListId
    ? lists.filter(l => String(l.id) === String(selectedListId))
    : lists;

  // Filter only lists with data for the "all lists" view
  const listsWithData = selectedListId
    ? listsToShow
    : listsToShow.filter(l => dataByList[l.id]);

  // Update currentIndex if lists change (e.g., after deletion)
  useEffect(() => {
    if (listsToShow.length === 0) {
      setCurrentIndex(0);
      setSelectedListId(null); // Reset to "all lists"
    } else if (currentIndex >= listsWithData.length) {
      setCurrentIndex(listsWithData.length - 1);
    }
  }, [listsToShow, listsWithData, currentIndex]);

  // Navigate to previous list
  const handlePrev = () => setCurrentIndex(i => (i > 0 ? i - 1 : i));

  // Navigate to next list
  const handleNext = () => setCurrentIndex(i => (i < listsWithData.length - 1 ? i + 1 : i));

  // If there are no lists to show, display a message
  if (!listsToShow.length) {
    return <p className="text-center text-gray-500 mt-6">אין רשימות להצגה</p>;
  }

  const currentList = listsWithData[currentIndex];
  const currentListData = currentList ? dataByList[currentList.id] : null;

  return (
    <div className="relative flex flex-col">

      {/* Carousel navigation buttons */}
      {listsWithData.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 z-10 pointer-events-none">

          {/* Previous button */}
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            whileHover={{ scale: currentIndex === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentIndex === 0 ? 1 : 0.95 }}
            className="pointer-events-auto text-sky-600 hover:text-sky-700 rounded-full border-2 px-3 py-2
                       flex items-center gap-2 cursor-pointer
                       disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100 backdrop-blur-sm"
          >
            <ArrowBigRight size={24} />
          </motion.button>

          {/* Next button */}
          <motion.button
            onClick={handleNext}
            disabled={currentIndex === listsWithData.length - 1}
            whileHover={{ scale: currentIndex === listsWithData.length - 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentIndex === listsWithData.length - 1 ? 1 : 0.95 }}
            className="pointer-events-auto text-sky-600 hover:text-sky-700 rounded-full border-2 px-3 py-2 
                       flex items-center gap-2 cursor-pointer
                       disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100 backdrop-blur-sm"
          >
            <ArrowBigLeft size={24} />
          </motion.button>
        </div>
      )}

      {/* Carousel content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentList && (
            <motion.div
              key={currentList.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ListChart
                list={currentList}       // Current list object
                listData={currentListData} // Statistics data for this list
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}