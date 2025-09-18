// React
import { useState } from "react";
import { useLocation } from "react-router-dom";

// Animations
import { motion } from "framer-motion";

// Components
import CustomMonthPicker from "../components/common/CustomMonthPicker"; // Month picker component
import Carousel from "../components/statistics/Carousel";               // Carousel for displaying statistics
import DataLoader from "../components/common/DataLoader";               // Loader component for async data

// Hooks
import { useStatistics } from "../hooks/useStatistics";                // Custom hook for fetching statistics

/**
 * StatisticsPage
 * 
 * A page for viewing monthly statistics of shopping lists.
 *
 * Features:
 * - Allows selecting a month using a custom month picker.
 * - Allows filtering statistics by a specific list or viewing all lists.
 * - Fetches statistics via a custom hook (`useStatistics`).
 * - Displays a loading indicator while fetching data.
 * - Renders a carousel of data grouped by list.
 */
export default function StatisticsPage() {
  const location = useLocation();
  const selectedListFromState = location.state?.list; // Optional list passed from navigation

  const today = new Date();

  // Local state for selected month and date picker
  const [date, setDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  // Selected list ID for filtering
  const [selectedListId, setSelectedListId] = useState(selectedListFromState?.id || "");

  // Fetch statistics for the selected month
  const { month, setMonth, lists, dataByList, loading, error } = useStatistics(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  /**
   * Handles month change from the custom month picker.
   * Resets the selected list filter when month changes.
   * @param {Date} selectedDate - the new selected date
   */
  const handleMonthChange = (selectedDate) => {
    setDate(selectedDate);

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    
    setMonth(`${yyyy}-${mm}`);
    setSelectedListId(""); // Reset list filter
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header controls: month picker + list filter */}
      <div className="flex-none p-4 mt-4 flex flex-row items-center gap-2">
        <CustomMonthPicker
          selectedDate={date}
          onMonthChange={handleMonthChange}
        />

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="min-w-[180px]"
        >
          <select
            name="list"
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            className="w-full py-2 px-3 text-md text-sky-600 font-bold font-huninn
                       bg-white/70 shadow-md rounded-xl focus:outline-none focus:ring-2
                       focus:ring-sky-400 transition-all duration-200 cursor-pointer"
          >
            <option value="">כל הרשימות</option> {/* Default: all lists */}
            {lists?.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Main content: either loader or statistics carousel */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 relative">
        {loading ? (
          <DataLoader loading={loading} blur={false} />
        ) : (
          <Carousel
            month={month}
            selectedListId={selectedListId || undefined}
            lists={lists}
            dataByList={dataByList}
          />
        )}
      </div>
    </div>
  );
}