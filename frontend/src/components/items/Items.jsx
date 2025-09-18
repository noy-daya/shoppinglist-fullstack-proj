// React & Hooks
import { useState } from "react";

// Components
import ItemRow from "./ItemRow";
import ItemCard from "./ItemCard";
import DataLoader from "../common/DataLoader";

// Animations
import { motion } from "framer-motion";

/**
 * Items
 * Displays a collection of items in two responsive formats:
 * - Desktop: Table view with rows
 * - Mobile: Card view with expandable details
 *
 * Props:
 * - items: Array of item objects to display
 * - units: Array of unit objects for quantity display
 * - editingIndex: Index of the item currently being edited
 * - editedItem: Object holding temporary changes for the edited item
 * - handleFieldUpdate: Function to update a field on an item
 * - handleSave: Function to save an edited item
 * - handleDelete: Function to delete an item
 * - handleBought: Function to toggle the bought status of an item
 * - setEditingIndex: Function to set which item is being edited
 * - errors: Object mapping itemId -> validation errors
 * - loading: Boolean indicating if items are being fetched
 */
export default function Items({
  items = [],
  units = [],
  editingIndex,
  editedItem,
  handleFieldUpdate,
  handleSave,
  handleDelete,
  handleBought,
  setEditingIndex,
  fieldErrors,
  loading = false,
}) {
  // State to track which cards are open in mobile view
  const [openCards, setOpenCards] = useState({});

  /**
   * toggleCard
   * Toggles the open/close state of a mobile card
   * @param {string|number} id - The item ID to toggle
   */
  const toggleCard = (id) => {
    setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className="relative min-h-[300px] flex items-center justify-center">
        <DataLoader loading={true} />
      </div>
    );
  }

  // --- No items state ---
  if (!loading && items.length === 0) {
    return (
      <motion.div
        className="relative min-h-[200px] flex flex-col items-center justify-center text-gray-500"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg font-medium">לא נשלפו מוצרים.</p>
      </motion.div>
    );
  }

  // --- Main render: desktop table + mobile cards ---
  return (
    <div className="relative">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[500px] md:max-h-[50vh]">
        <table className="table table-md table-pin-rows table-pin-cols text-right rtl border-separate border-spacing-y-2">
          <thead>
            <tr className="text-sky-600">
              <th></th>
              <th className="w-55">שם</th>
              <th className="w-40">מותג</th>
              <th className="w-30">כמות</th>
              <th className="w-40">יח'</th>
              <th>הערות</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) &&
              items.map((item, idx) => (
                <ItemRow
                  key={item?.id ?? idx}
                  index={idx}
                  item={item}
                  units={Array.isArray(units) ? units : []}
                  editingIndex={editingIndex}
                  editedItem={editedItem}
                  handleFieldUpdate={handleFieldUpdate}
                  handleSave={handleSave}
                  handleDelete={handleDelete}
                  handleBought={handleBought}
                  setEditingIndex={setEditingIndex}
                  fieldErrors={fieldErrors?.[item?.id] || {}}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden block w-full space-y-4">
        {Array.isArray(items) &&
          items.map((item, idx) => (
            <ItemCard
              key={item?.id ?? idx}
              item={item}
              index={idx}
              units={Array.isArray(units) ? units : []}
              handleFieldUpdate={handleFieldUpdate}
              handleDelete={handleDelete}
              handleSave={handleSave}
              handleBought={handleBought}
              isOpen={!!openCards[item?.id]}
              toggleOpen={toggleCard}
              fieldErrors={fieldErrors?.[item?.id] || {}}
            />
          ))}
      </div>
    </div>
  );
}