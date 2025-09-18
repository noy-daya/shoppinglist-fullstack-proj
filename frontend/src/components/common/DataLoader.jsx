import { motion, AnimatePresence } from "framer-motion";

/**
 * DataLoader component
 * Animated loading indicator with three bouncing dots.
 *
 * Props:
 * - loading: Boolean, whether to show the loader
 * - blur: Boolean, optional. If true, applies a backdrop blur behind the loader
 *
 * Features:
 * - Fades in/out using AnimatePresence
 * - Bouncing dot animation using Framer Motion
 * - Optional backdrop blur for emphasis
 */
const DataLoader = ({ loading, blur = false }) => {
  const dots = [0, 1, 2]; // Three dots for animation

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}    // Fade in
          animate={{ opacity: 1 }}    // Fully visible
          exit={{ opacity: 0 }}       // Fade out when removed
          transition={{ duration: 0.2 }}
          className={`absolute inset-x-0 flex justify-center z-50
            ${blur ? "backdrop-blur-sm" : ""} py-8`}
        >
          <div className="flex space-x-3">
            {dots.map((dot, index) => (
              <motion.span
                key={index}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-white/60 to-white/60"
                animate={{ scale: [0.7, 1.2, 0.7], y: [0, -6, 0] }} // Bounce animation
                transition={{
                  duration: 0.6,            
                  repeat: Infinity,         // Repeat forever
                  delay: index * 0.15,      // Staggered start for each dot
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataLoader;
