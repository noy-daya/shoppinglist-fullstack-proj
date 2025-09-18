import { useRef, useEffect } from 'react';

/**
 * Modal component
 * A reusable modal dialog that closes when clicking outside.
 *
 * Props:
 * - isOpen: Boolean, whether the modal is visible
 * - onClose: Callback triggered when modal is closed (by clicking outside)
 * - onNext: Optional callback for any next action (not used in current implementation)
 * - children: React nodes to render inside the modal
 *
 * Features:
 * - Closes automatically when clicking outside the modal content
 * - Returns null when not open (does not render in DOM)
 */
export default function Modal({ isOpen, onClose, onNext, children }) {
  const modalRef = useRef(null); // ref to modal DOM element

  useEffect(() => {
    // Handles clicks outside the modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close modal if clicked outside
      }
    };

    // Register event listener only if modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on unmount or when dependencies change
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // re-run effect whenever isOpen or onClose changes

  // Do not render modal if not open
  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[1000] flex items-center justify-center">
      <div
        ref={modalRef} // when DOM of div is loaded, update modalRef.current to the element
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="mb-2">{children}</div>
      </div>
    </div>
  );
}