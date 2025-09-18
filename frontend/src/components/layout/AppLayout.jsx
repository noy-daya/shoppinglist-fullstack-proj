import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// components
import TopNavbar from './TopNavbar';
import SideMenu from './SideMenu';
import ScrollTopButton from '../common/ScrollTopButton';

/**
 * AppLayout
 * The main layout component for the application.
 */
export default function AppLayout() {
  // State for controlling the side menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for controlling visibility of scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Ref to the main scrollable content area
  const mainRef = useRef(null);

  /**
   * useEffect: listens to scroll events on the main content
   * Shows the ScrollTopButton after scrolling down 200px
   */
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      setShowScrollTop(mainEl.scrollTop > 200);
    };

    mainEl.addEventListener('scroll', handleScroll);

    // Cleanup listener on unmount
    return () => {
      mainEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation bar */}
      <TopNavbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Side menu */}
      <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main scrollable content area */}
      <main
        ref={mainRef}
        className="flex-1 min-h-0 overflow-auto pt-12 md:px-8 scrollbar-hide"
      >
        <Outlet /> {/* Render child routes here */}
      </main>

      {/* Footer */}
      <footer className="bg-transparent backdrop-blur text-center py-6 text-md text-white">
        &copy; {new Date().getFullYear()} נבנה ע"י Noy Daya
      </footer>

      {/* Scroll-to-top button */}
      <ScrollTopButton show={showScrollTop} />
    </div>
  );
}
