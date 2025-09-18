// React & Hooks
import { useState } from "react";

// Icons & Animations
import { Save, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Components
import CustomInput from "../common/CustomInput";

/**
 * ItemRow
 * A table row representing a single item for desktop view.
 *
 * Features:
 * - Editable fields for name, brand, quantity, unit, and comments
 * - Checkbox for bought status
 * - Displays loading states for save/delete operations
 *
 * Props:
 * - item: Object representing the item
 * - units: Array of unit objects
 * - handleFieldUpdate: Function to update a field on the item
 * - handleSave: Function to save the item
 * - handleDelete: Function to delete the item
 * - handleBought: Function to toggle bought status
 * - fieldErrors: Object mapping field names to validation errors
 */
export default function ItemRow({
  item,
  units,
  handleFieldUpdate,
  handleSave,
  handleDelete,
  handleBought,
  fieldErrors = {},
}) {
  const [savingLoading, setSavingLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

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
    <tr>
      {/* Bought checkbox */}
      <td>
        <input
          name="bought"
          type="checkbox"
          className="checkbox checkbox-info"
          checked={item.bought === true}
          onChange={(e) => handleBought(item.id, e.target.checked)}
        />
      </td>

      {/* Name */}
      <td>
        <CustomInput itemId={item.id} field="name" value={item.name ?? ""} placeholder="שם פריט" maxLength={50} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} isErrorTooltip={true} />
      </td>

      {/* Brand */}
      <td>
        <CustomInput itemId={item.id} field="brand" value={item.brand ?? ""} placeholder="מותג" maxLength={50} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} isErrorTooltip={true} />
      </td>

      {/* Quantity */}
      <td>
        <CustomInput itemId={item.id} field="quantity" type="number" value={item.quantity ?? ""} placeholder="כמות" min={1} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} isErrorTooltip={true} />
      </td>

      {/* Unit */}
      <td>
        <select name="unit" value={item.unitId ?? ""} onChange={(e) => handleFieldUpdate(item.id, "unitId", parseInt(e.target.value))} className="select select-bordered select-md w-full">
          {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </td>

      {/* Comments */}
      <td>
        <CustomInput itemId={item.id} field="comments" value={item.comments ?? ""} placeholder="הערות" maxLength={100} fieldErrors={fieldErrors} handleFieldUpdate={handleFieldUpdate} isErrorTooltip={true} />
      </td>

      {/* Action buttons */}
      <td className="flex gap-2">
        <motion.button whileHover={{ scale: savingLoading ? 1 : 1.1 }} whileTap={{ scale: savingLoading ? 1 : 0.95 }} onClick={onSave} disabled={savingLoading} className="text-sky-600 hover:text-sky-700 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default">
          <div className="w-4 flex justify-center">{savingLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}</div>
          <span className="inline-block min-w-[60px] text-center">{savingLoading ? "מעדכן..." : "עדכון"}</span>
        </motion.button>

        <motion.button whileHover={{ scale: deletingLoading ? 1 : 1.1 }} whileTap={{ scale: deletingLoading ? 1 : 0.95 }} onClick={onDelete} disabled={deletingLoading} className="text-red-500 hover:text-red-600 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default">
          <div className="w-4 flex justify-center">{deletingLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <X size={16} />}</div>
          <span className="inline-block min-w-[60px] text-center">{deletingLoading ? "מוחק..." : "מחיקה"}</span>
        </motion.button>
      </td>
    </tr>
  );
}