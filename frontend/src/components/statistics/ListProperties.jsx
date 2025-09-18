// Icons
import { ShoppingBasket, List } from "lucide-react";

// Animations
import { motion } from "framer-motion";

/**
 * ListProperties
 * 
 * Displays key properties of a shopping list, including:
 * - List name with a stylish gradient badge
 * - Total quantity of items in the list with a basket icon
 *
 * Props:
 * - list: object { id, name, ... } – the shopping list data
 * - totalQuantity: number – total number of items in the list
 */
export default function ListProperties({ list, totalQuantity }) {
  return (
    <div className="flex gap-4 w-full max-w-xl items-center mb-2">
      {/* List name with gradient background */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-5 py-2 
                   rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-sky-300
                   text-white font-semibold shadow-md hover:shadow-xl
                   transition-all duration-200"
      >
        <List size={20} className="opacity-90" />
        <span className="text-md tracking-wide">{list.name}</span>
      </motion.div>

      {/* Total quantity badge */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-xl 
                   bg-sky-50 border border-sky-200 
                   text-sky-600 font-medium shadow-sm"
      >
        <ShoppingBasket size={18} className="text-sky-500" />
        <span className="text-base">{totalQuantity}</span>
      </div>
    </div>
  );
}