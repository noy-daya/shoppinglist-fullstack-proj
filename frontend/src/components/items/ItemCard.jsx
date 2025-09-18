// React & Hooks
import { useState } from "react";

// Icons & Animations
import { ChevronDown, ChevronLeft, Save, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Components
import CustomInput from "../common/CustomInput";

/**
 * ItemCard
 * A card UI representing a single item for mobile view.
 *
 * Features:
 * - Expand/collapse to show editable fields
 * - Checkbox for bought status
 * - Displays loading states for save/delete operations
 *
 * Props:
 * - item: Object representing the item
 * - units: Array of unit objects
 * - handleFieldUpdate: Function to update a field on the item
 * - handleDelete: Function to delete the item
 * - handleSave: Function to save the item
 * - handleBought: Function to toggle bought status
 * - isOpen: Boolean indicating if card is expanded
 * - toggleOpen: Function to toggle open/close state
 * - fieldErrors: Object mapping field names to validation errors
 */
export default function ItemCard({
  item,
  units,
  handleFieldUpdate,
  handleDelete,
  handleSave,
  handleBought,
  isOpen = false,
  toggleOpen,
  fieldErrors = {},
}) {
  const [savingLoading, setSavingLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const labelColor = isOpen ? "text-white" : "text-sky-700";

  /** Save handler */
  const onSave = async () => {
    try {
      setSavingLoading(true);
      await handleSave(item);
    } finally {
      setSavingLoading(false);
    }
  };

  /** Delete handler */
  const onDelete = async () => {
    try {
      setDeletingLoading(true);
      await handleDelete(item.id);
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div className={`w-full rounded-xl p-4 space-y-3 text-right transition-all duration-300 ${isOpen ? "bg-white/20" : "bg-white/60"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between cursor-pointer ${labelColor}`} onClick={() => toggleOpen(item.id)}>
        <div className="flex items-center gap-2 font-semibold text-base">
          <input
            name="bought"
            type="checkbox"
            className="checkbox checkbox-info"
            checked={item.bought === true}
            onChange={(e) => handleBought(item.id, e.target.checked)}
          />
          {isOpen ? <ChevronDown className="text-white" /> : <ChevronLeft className="text-sky-500" />}
          <span className={item.bought ? "line-through text-gray-400" : ""}>{item.name ?? ""}</span>
        </div>
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div className="space-y-3 mt-3">
          {/* Fields */}
          <div>
            <p className={`block text-md mb-1 ${labelColor}`}>שם</p>
            <CustomInput itemId={item.id} field="name" value={item.name ?? ""} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} />
          </div>
          <div>
            <p className={`block text-md mb-1 ${labelColor}`}>מותג</p>
            <CustomInput itemId={item.id} field="brand" value={item.brand ?? ""} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className={`block text-md mb-1 ${labelColor}`}>כמות</p>
              <CustomInput itemId={item.id} field="quantity" type="number" value={item.quantity ?? ""} min={1} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} />
            </div>
            <div className="flex-1">
              <p className={`block text-md mb-1 ${labelColor}`}>יח'</p>
              <select name="unit" value={item.unitId ?? ""} onChange={(e) => handleFieldUpdate(item.id, "unitId", parseInt(e.target.value))} className="select select-bordered select-md w-full">
                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className={`block text-md mb-1 ${labelColor}`}>הערות</p>
            <CustomInput itemId={item.id} field="comments" value={item.comments ?? ""} maxLength={100} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2 text-md overflow-x-auto no-scrollbar scrollbar-hide p-2">
            <motion.button
              whileHover={{ scale: savingLoading ? 1 : 1.05 }}
              whileTap={{ scale: savingLoading ? 1 : 0.95 }}
              onClick={onSave}
              disabled={savingLoading}
              className="text-sky-600 hover:text-sky-700 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <div className="w-4 flex justify-center">{savingLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}</div>
              <span className="inline-block min-w-[60px] text-center">{savingLoading ? "מעדכן..." : "עדכון"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: deletingLoading ? 1 : 1.05 }}
              whileTap={{ scale: deletingLoading ? 1 : 0.95 }}
              onClick={onDelete}
              disabled={deletingLoading}
              className="text-red-500 hover:text-red-600 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <div className="w-4 flex justify-center">{deletingLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <X size={16} />}</div>
              <span className="inline-block min-w-[60px] text-center">{deletingLoading ? "מוחק..." : "מחיקה"}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}