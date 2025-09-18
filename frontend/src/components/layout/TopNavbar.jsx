import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * TopNavbar
 * A fixed top navigation bar with:
 *  - Hamburger menu button to toggle side menu
 *  - Logo that navigates to home page
 *
 * Props:
 * - isMenuOpen: Boolean controlling the hamburger menu state
 * - setIsMenuOpen: Function to toggle menu open/closed
 */
export default function TopNavbar({ isMenuOpen, setIsMenuOpen }) {
  // Animation variants for the hamburger button
  const hamburgerVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 90, scale: 1.1 },
  };

  return (
    <nav className="fixed top-0 w-full bg-opacity-50 shadow-md backdrop-blur-lg z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Hamburger menu button */}
        <motion.button
          className="text-white focus:outline-none cursor-pointer"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={hamburgerVariants}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="space-y-1">
            {/* Top line */}
            <motion.div
              className="w-6 h-0.5 bg-white rounded"
              animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Middle line */}
            <motion.div
              className="w-6 h-0.5 bg-white rounded"
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {/* Bottom line */}
            <motion.div
              className="w-6 h-0.5 bg-white rounded"
              animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>

        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-white font-huninn tracking-wide select-none">
          ShoppingList
        </Link>

        {/* Spacer for responsive layout */}
        <div className="md:hidden w-6" />
      </div>
    </nav>
  );
}
