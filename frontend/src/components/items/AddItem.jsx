// React & Hooks
import { useState, useEffect } from "react";

// Icons & Animations
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import CustomInputFloating from "../common/CustomInputFloating";

// Validators
import { validateItemAddition } from "../../validators/itemValidator";

/**
 * AddItem
 * Drawer component for adding a new item to a list.
 *
 * Features:
 * - Floating input fields with real-time validation
 * - Select unit from provided units array
 * - Displays loading state during async addition
 *
 * Props:
 * - listId: ID of the list to which the item is added
 * - drawerOpen: Boolean to control drawer visibility
 * - onClose: Function to close the drawer
 * - units: Array of unit objects {id, name} for selection
 * - onAdd: Async function to handle adding a new item
 */
export default function AddItem({ listId, drawerOpen, onClose, units, onAdd }) {
  // Local state for form fields
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.id || 0);

  // Local loading state during async add operation
  const [addingLoading, setAddingLoading] = useState(false);

  // Validation errors mapped by field name
  const [fieldErrors, setFieldErrors] = useState({});

  // Ensure selectedUnit is always set if units change
  useEffect(() => {
    if (units.length > 0) {
      setSelectedUnit(units[0].id);
    }
  }, [units]);

  // Validate fields in real-time on change
  useEffect(() => {
    const validationErrors = validateItemAddition({
      name: itemName,
      brand,
      quantity,
      unitId: selectedUnit,
      comments,
    });
    setFieldErrors(validationErrors);
  }, [itemName, brand, quantity, selectedUnit, comments]);

  /** Handle form submission to add new item */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if there are validation errors
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      setAddingLoading(true); // show loader
      await onAdd({
        name: itemName,
        brand,
        quantity: Number(quantity),
        unitId: Number(selectedUnit),
        comments,
        listId: Number(listId),
      });

      // Reset form fields after successful addition
      setItemName("");
      setBrand("");
      setQuantity(1);
      setComments("");
      setSelectedUnit(units[0]?.id || 0);
      setFieldErrors({});
    } finally {
      setAddingLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex z-[9999]">
          {/* Semi-transparent backdrop */}
          <motion.div
            className="fixed inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer panel */}
          <motion.div
            className="relative w-11/12 sm:w-96 bg-white/80 backdrop-blur-lg 
                       shadow-2xl p-6 overflow-y-auto max-h-screen z-50
                       rounded-l-3xl border-l border-sky-200 font-huninn"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-sky-800">הוסף מוצר לקטגוריה</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid gap-7">
              <CustomInputFloating
                id="itemName"
                label="* שם הפריט"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                error={fieldErrors.name}
                maxLength={50}
              />
              <CustomInputFloating
                id="brand"
                label="מותג"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                error={fieldErrors.brand}
                maxLength={50}
              />
              <CustomInputFloating
                id="quantity"
                label="* כמות"
                type="number"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={fieldErrors.quantity}
              />
              <div>
                <p className="block text-md text-gray-600 mb-1">יחידת מידה</p>
                <select
                  id="unit"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 
                             focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <CustomInputFloating
                id="comments"
                label="הערות"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                error={fieldErrors.comments}
                maxLength={100}
              />

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: addingLoading ? 1 : 1.03 }}
                whileTap={{ scale: addingLoading ? 1 : 0.97 }}
                className="mt-2 bg-gradient-to-r from-sky-600 to-sky-500 
             text-white px-4 py-2 rounded-xl shadow-md 
             hover:shadow-lg transition-all cursor-pointer
             flex items-center justify-center gap-2 flex-row-reverse disabled:opacity-50"
              >
                {addingLoading && <Loader2 className="animate-spin w-4 h-4" />}
                {addingLoading ? "מוסיף..." : "הוסף"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}