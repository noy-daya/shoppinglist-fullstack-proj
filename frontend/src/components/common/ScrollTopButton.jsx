import { motion } from "framer-motion";

/**
 * ScrollTopButton
 * A floating button that scrolls the page to the top when clicked.
 *
 * Props:
 * - show: Boolean indicating whether the button should be visible
 *
 * Features:
 * - Smooth scroll to top of the <main> element
 */
export default function ScrollTopButton({ show }) {
  if (!show) return null; // Do not render if not visible

  const handleScrollTop = () => {
    const mainEl = document.querySelector("main"); // Target the main content area
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
    }
  };

  return (
    <motion.button
      onClick={handleScrollTop}
      className="fixed bottom-20 left-6 z-[999] bg-sky-600/10 text-sky-600 p-3 rounded-full hover:bg-sky-600/20 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -6, 0] }} // Infinite bounce animation
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
      aria-label="חזרה לראש הדף"
    >
      ↑
    </motion.button>
  );
}
