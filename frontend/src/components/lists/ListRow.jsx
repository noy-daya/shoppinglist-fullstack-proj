// React & Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons & Animations
import { X, Save, ShoppingBasket, Loader2, PieChart } from "lucide-react";
import { motion } from "framer-motion";

// Utils
import { format } from "date-fns";

// Components
import CustomInput from "../common/CustomInput";

/**
 * ListRow
 * A table row representing a single shopping list.
 *
 * Features:
 * - Editable name field with inline validation
 * - Displays loading states for save/delete operations
 */
export default function ListRow({
  list,
  index,
  handleViewItems,
  handleDelete,
  handleFieldUpdate,
  handleSave,
  fieldErrors = {},
}) {
  // Whether save operation is loading
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  // Whether delete operation is loading
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();

  /** Save handler */
  const onSave = async () => {
    try {
      setIsLoadingSave(true);
      await handleSave(list);
    } finally {
      setIsLoadingSave(false);
    }
  };

  /** Delete handler */
  const onDelete = async () => {
    try {
      setIsLoadingDelete(true);
      await handleDelete(list.id);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <tr>
      {/* Editable name */}
      <td>
        <CustomInput
          field="name"
          type="text"
          value={list.name ?? ""}
          placeholder="שם רשימה"
          maxLength="50"
          fieldErrors={fieldErrors}
          handleFieldUpdate={handleFieldUpdate}
          index={index}
          isErrorTooltip={true}
        />
      </td>

      {/* Creation date */}
      <td>
        <input
          name="createdAt"
          type="text"
          value={format(new Date(list.createdAt), "dd/MM/yyyy HH:mm")}
          disabled
          className="input input-bordered input-md w-full"
        />
      </td>

      {/* Action buttons */}
      <td className="flex gap-2 flex-wrap">
        {/* View items */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleViewItems(list)}
          className="text-sky-400 hover:text-sky-600 rounded-full border-2 p-2 flex justify-center items-center gap-2 cursor-pointer"
        >
          <ShoppingBasket size={16} />
          <span className="inline-block min-w-[80px] text-center">צפייה בסל</span>
        </motion.button>

        {/* Save */}
        <motion.button
          whileHover={{ scale: isLoadingSave ? 1 : 1.05 }}
          whileTap={{ scale: isLoadingSave ? 1 : 0.95 }}
          onClick={onSave}
          disabled={isLoadingSave}
          className="text-sky-500 hover:text-sky-600 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          <div className="w-4 flex justify-center">
            {isLoadingSave ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save size={16} />
            )}
          </div>
          <span className="inline-block min-w-[60px] text-center">
            {isLoadingSave ? "מעדכן..." : "עדכון"}
          </span>
        </motion.button>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: isLoadingDelete ? 1 : 1.05 }}
          whileTap={{ scale: isLoadingDelete ? 1 : 0.95 }}
          onClick={onDelete}
          disabled={isLoadingDelete}
          className="text-red-500 hover:text-red-600 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          <div className="w-4 flex justify-center">
            {isLoadingDelete ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <X size={16} />
            )}
          </div>
          <span className="inline-block min-w-[60px] text-center">
            {isLoadingDelete ? "מוחק..." : "מחיקה"}
          </span>
        </motion.button>

        {/* Statistics */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/statistics-page", { state: { list } })}
          className="text-lime-400 hover:text-lime-500 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer"
        >
          <PieChart className="w-4 h-4" />
          <span className="inline-block min-w-[80px] text-center">סטטיסטיקה</span>
        </motion.button>
      </td>
    </tr>
  );
}
