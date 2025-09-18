// React & Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons & Animations
import { ChevronDown, ChevronLeft, Save, X, ShoppingBasket, Loader2, ChartPie } from "lucide-react";
import { motion } from "framer-motion";

// Utils
import { format } from "date-fns";

// Components
import CustomInput from "../common/CustomInput";

/**
 * ListCard
 * A card UI representing a single shopping list.
 *
 * Features:
 * - Expand/collapse to show details and actions
 * - Displays loading states for save/delete operations
 */
export default function ListCard({
  list,
  index,
  isOpen,
  toggleOpen,
  handleFieldUpdate,
  handleSave,
  handleDelete,
  handleViewItems,
  fieldErrors = {},
}) {
  // Whether save operation is loading
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  // Whether delete operation is loading
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const labelColor = isOpen ? "text-white" : "text-sky-700";

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
  const onDelete = async (e) => {
    e.stopPropagation(); // Prevent closing card on click
    try {
      setIsLoadingDelete(true);
      await handleDelete(list.id);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <div
      className={`w-full rounded-xl p-4 space-y-3 text-right transition-all duration-300 ${
        isOpen ? "bg-white/20" : "bg-white/60"
      }`}
    >
      {/* Header row */}
      <div
        className={`flex items-center justify-between cursor-pointer ${labelColor}`}
        onClick={() => toggleOpen(index)}
      >
        <div className="flex items-center gap-2 font-semibold text-base">
          {isOpen ? (
            <ChevronDown className="text-white" />
          ) : (
            <ChevronLeft className="text-sky-500" />
          )}
          <span>{list.name ?? ""}</span>
        </div>
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div className="space-y-3 mt-3">
          {/* Editable name */}
          <div>
            <p className={`block text-md mb-1 ${labelColor}`}>שם</p>
            <CustomInput
              field="name"
              type="text"
              value={list.name ?? ""}
              placeholder="שם רשימה"
              maxLength="50"
              fieldErrors={fieldErrors}
              handleFieldUpdate={handleFieldUpdate}
              index={index}
              isErrorTooltip={false}
            />
          </div>

          {/* Creation date */}
          <div>
            <p className={`block text-md mb-1 ${labelColor}`}>תאריך יצירה</p>
            <input
              type="text"
              value={format(new Date(list.createdAt), "dd/MM/yyyy HH:mm")}
              disabled
              className="input input-bordered input-md w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2 text-md overflow-x-auto no-scrollbar scrollbar-hide p-2">
            {/* View items */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewItems(list)}
              className="text-white hover:text-sky-500 rounded-full border-2 p-2 flex justify-center items-center gap-2 cursor-pointer"
            >
              <ShoppingBasket size={16} />
              <span className="inline-block min-w-[80px] text-center">
                צפייה בסל
              </span>
            </motion.button>

            {/* Save */}
            <motion.button
              whileHover={{ scale: isLoadingSave ? 1 : 1.05 }}
              whileTap={{ scale: isLoadingSave ? 1 : 0.95 }}
              onClick={onSave}
              disabled={isLoadingSave}
              className="text-sky-600 hover:text-sky-700 rounded-full border-2 p-2 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
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
              <div className="w-4 flex justify-center">
                <ChartPie size={16} />
              </div>
              <span className="inline-block min-w-[60px] text-center">
                סטטיסטיקה
              </span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
