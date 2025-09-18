import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { House, PenSquare, ChartNoAxesCombined } from "lucide-react";

/**
 * SideMenu
 * A sliding side navigation menu for the application.
 * 
 * Props:
 * - isMenuOpen: Boolean controlling visibility of the side menu
 * - setIsMenuOpen: Function to toggle the menu open/closed
 *
 * Features:
 * - Highlights the active navigation item
 * - Closes automatically when clicking outside of the menu
 */
export default function SideMenu({ isMenuOpen, setIsMenuOpen }) {
  const menuRef = useRef(null);   // Reference to the menu element
  const location = useLocation();  // React Router location for active link

  // Navigation items
  const navItems = [
    { label: 'דף ראשי', to: '/', icon: House },
    { label: 'רשימות', to: '/lists-page', icon: PenSquare },
    { label: 'סטטיסטיקה', to: '/statistics-page', icon: ChartNoAxesCombined },
  ];

  /**
   * Close menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            className="fixed inset-0 z-[998] bg-white/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sliding side menu */}
          <motion.aside
            ref={menuRef}
            className="fixed top-0 right-0 h-full w-72 
                        bg-white/70 backdrop-blur-lg
                        shadow-lg rounded-l-3xl 
                        z-[999] p-6 flex flex-col space-y-8
                        border-r border-sky-200"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div style={{ direction: 'rtl' }}>
              <div className="flex items-center justify-center">
                <h2 className="text-2xl mb-4 font-bold text-sky-600 font-huninn tracking-wide">
                  תפריט ניווט
                </h2>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col space-y-3 font-huninn">
                {navItems.map(({ label, to, icon: Icon }) => {
                  const isActive = location.pathname === to;

                  return (
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 4 }} 
                      whileTap={{ scale: 0.98 }} 
                      key={label}
                    >
                      <Link
                        to={to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 font-medium select-none 
                        ${isActive
                          ? 'bg-gradient-to-l from-sky-500 to-sky-400 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-sky-200/80 hover:text-sky-700'
                        }`}
                      >
                        <Icon size={24} className={`${isActive ? 'text-white' : 'text-sky-500'}`} />
                        <span className="text-lg font-bold">{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
