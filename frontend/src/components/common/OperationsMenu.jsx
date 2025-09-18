// React & Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Animations & Icons
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChartPie, Download } from "lucide-react";

// Utils
import { generatePdfFromList } from "../../utils/pdfUtils";

// API
import { fetchItems } from "../../api/items";

// Context
import { useErrorHandler } from "../../context/ErrorContext"; // for success/error notifications

/**
 * OperationsMenu component
 * A floating vertical menu that provides operations on a list:
 *  - Add item
 *  - View statistics
 *  - Download list as PDF
 *
 * Props:
 * - list: the current list object containing categories and items
 * - onAddClick: callback for the "Add" button (as received from parent)
 * - showItems: array of strings ["plus", "stats", "download"] indicating which menu items to show
 *
 * Features:
 * - Handles PDF generation, API fetching, and navigation
 * - Shows success/error notifications using useErrorHandler
 */
export default function OperationsMenu({ list, onAddClick, showItems = ["plus", "stats", "download"] }) {
  const navigate = useNavigate();
  const { showError, showSuccess } = useErrorHandler();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * handleDownload
   * Fetches items for all categories and generates a PDF
   */
  const handleDownload = async () => {
    if (!list) return;

    const categories = list.categories || [];
    const itemsByCategory = {};

    try {
      // Fetch all items per category in parallel
      await Promise.all(
        categories.map(async (cat) => {
          let items = await fetchItems(list.id, cat.id);
          if (!Array.isArray(items)) items = items ? [items] : [];
          itemsByCategory[cat.id] = items.map((item) => ({
            name: item?.name || "",
            brand: item?.brand || "",
            quantity: item?.quantity || "",
            unit: typeof item?.unit === "object" ? item.unit.name : (item?.unit || ""),
            comments: item?.comments || "",
          }));
        })
      );

      const pdfList = {
        name: list.name,
        categories: categories
          .map(cat => ({ id: cat.id, name: cat.name, items: itemsByCategory[cat.id] || [] }))
          .filter(cat => (cat.items || []).length > 0),
      };

      if (!pdfList.categories.length) {
        showError(new Error("לא ניתן להפיק קובץ PDF עבור רשימה ריקה."));
        return;
      }

      generatePdfFromList(pdfList);
      showSuccess("קובץ PDF הופק בהצלחה.");
    } catch (err) {
      console.error(err);
      showError(err);
    }
  };

  /**
   * handleNavigateStats
   * Navigate to statistics page with safe list data
   */
  const handleNavigateStats = () => {
    if (!list) return;

    try {
      const safeList = {
        id: list.id,
        name: list.name,
        categories: (list.categories || []).map(cat => ({ id: cat.id, name: cat.name })),
      };
      navigate("/statistics-page", { state: { list: safeList } });
    } catch (err) {
      showError(err);
    }
  };

  // Define menu items with icons, callbacks, and colors
  const allMenuItems = {
    plus: { icon: <Plus size={24} />, onClick: onAddClick, bg: "bg-sky-400", hover: "hover:bg-sky-500" },
    stats: { icon: <ChartPie size={24} />, onClick: handleNavigateStats, bg: "bg-lime-400", hover: "hover:bg-lime-500" },
    download: { icon: <Download size={24} />, onClick: handleDownload, bg: "bg-sky-300", hover: "hover:bg-sky-400" },
  };

  // Filter only the menu items specified in showItems
  const menuItems = showItems.map(key => allMenuItems[key]).filter(Boolean);

  return (
    <div className="fixed top-1/3 left-0 z-[50]">
      <div className="relative">
        {/* Main toggle button */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="w-8 h-20 bg-sky-500 rounded-tr-lg rounded-br-lg flex items-center justify-center shadow-lg cursor-pointer"
        >
          <span className="text-white rotate-90 text-sm font-bold select-none">פעולות</span>
        </button>

        {/* Animated menu items */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-12 top-1/2 transform -translate-y-1/2 flex gap-2 rounded-xl p-2"
            >
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={`w-12 h-12 flex items-center text-white justify-center rounded-xl shadow-md transition-colors cursor-pointer ${item.bg} ${item.hover}`}
                >
                  {item.icon}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}