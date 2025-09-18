// React & Hooks
import { motion } from "framer-motion";

// Icons
import { Ellipsis as MenuIcon } from "lucide-react";

/**
 * CategorySidebar
 * Responsive sidebar/carousel component for displaying categories.
 *
 * Features:
 * - Desktop: Vertical sidebar with expandable width
 * - Mobile: Horizontal bottom carousel
 * - Highlights selected category
 * - Smooth animations for hover, tap, and opening/closing sidebar
 *
 * Props:
 * - categories: Array of category objects { id, name, icon }
 * - selectedCategory: Currently selected category object
 * - setSelectedCategory: Function to update the selected category
 * - sidebarExpanded: Boolean to control sidebar width (desktop)
 * - toggleSidebar: Function to expand/collapse sidebar (desktop)
 */
export default function CategorySidebar({
  categories = [],
  selectedCategory = {},
  setSelectedCategory,
  sidebarExpanded = true,
  toggleSidebar
}) {
  const carouselHeight = 80; // Height of mobile carousel spacer

  return (
    <div>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`hidden md:flex bg-white/80 backdrop-blur-lg border-r border-sky-100 transition-all duration-300 shadow-lg ${sidebarExpanded ? "w-56" : "w-20"} p-2 pt-5 flex flex-col items-center self-start max-h-screen overflow-y-auto rounded-3xl mt-18 max-h-[500px] md:max-h-[70vh]`}
      >
        {/* Toggle sidebar button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={toggleSidebar}
          className="mb-4 text-sky-600 hover:text-sky-800 cursor-pointer select-none"
        >
          <MenuIcon />
        </motion.button>

        {/* Category buttons */}
        <nav className="flex flex-col gap-2 w-full">
          {categories.map(({ id, name, icon: Icon }) => {
            const isActive = selectedCategory?.id === id;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory({ id, name })}
                className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-xl cursor-pointer font-huninn transition-all duration-200 select-none ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md"
                    : "text-gray-700 hover:bg-sky-100 hover:text-sky-800"
                }`}
              >
                {Icon && <Icon size={22} />}
                {sidebarExpanded && <span className="text-md truncate">{name}</span>}
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile Carousel */}
      <motion.nav
        className="flex md:hidden bg-white/80 backdrop-blur-lg border-t border-sky-100 transition-all duration-300 shadow-lg w-full p-2 flex-row items-center overflow-x-auto whitespace-nowrap scrollbar-hide rounded-t-3xl fixed bottom-0 z-50"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map(({ id, name, icon: Icon }) => {
          const isActive = selectedCategory?.id === id;
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory({ id, name })}
              className={`flex-shrink-0 flex flex-col items-center gap-1 min-w-[70px] px-3 py-2 rounded-xl cursor-pointer mr-4 last:mr-0 font-huninn transition-all duration-200 select-none ${
                isActive
                  ? "bg-gradient-to-b from-sky-500 to-sky-400 text-white shadow-md"
                  : "text-gray-700 hover:bg-sky-100 hover:text-sky-800"
              }`}
            >
              {Icon && <Icon size={22} />}
              <span className="text-xs truncate w-full text-center">{name}</span>
            </motion.button>
          );
        })}
      </motion.nav>

      {/* Spacer for mobile carousel */}
      <div className="md:hidden" style={{ height: `${carouselHeight}px` }} />
    </div>
  );
}