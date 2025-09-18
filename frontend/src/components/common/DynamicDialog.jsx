// *********** UNUSED COMPONENT ***********
// DynamicDialog is currently not used anywhere in the application.

import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Icon mapping for different dialog modes
 */
const iconMap = {
    success: <CheckCircle className="text-green-500 w-6 h-6" />,
    error: <XCircle className="text-red-500 w-6 h-6" />,
    warning: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
    info: <Info className="text-sky-500 w-6 h-6" />,
};

/**
 * DynamicDialog component
 * A modal dialog that supports alert and confirm types, with different visual modes.
 *
 * Props:
 * - open: Boolean, whether the dialog is visible
 * - type: "alert" | "confirm" (default "alert") – determines button layout
 * - mode: "success" | "error" | "warning" | "info" (default "info") – sets icon and color
 * - title: Dialog title text
 * - message: Dialog message text
 * - onConfirm: Callback for confirm action (only for "confirm" type)
 * - onCancel: Callback for cancel action (only for "confirm" type)
 * - onClose: Callback for closing the dialog (only for "alert" type)
 *
 * Features:
 * - Uses AnimatePresence and Framer Motion for smooth fade and scale animations
 * - Displays an icon based on mode
 * - Conditional button layout depending on type (alert or confirm)
 */
export default function DynamicDialog({
    open,
    type = "alert", // alert | confirm
    mode = "info",   // success | error | warning | info
    title = "",
    message = "",
    onConfirm,
    onCancel,
    onClose,
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm font-huninn"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 border border-gray-200"
                    >
                        {/* Title with icon */}
                        <div className="flex items-center gap-3">
                            {iconMap[mode] || iconMap.info}
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        </div>

                        {/* Message text */}
                        <p className="text-gray-700 leading-relaxed">{message}</p>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            {type === "confirm" ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        onClick={onCancel}
                                        className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        ביטול
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        onClick={onConfirm}
                                        className="px-4 py-2 rounded-full border-2 border-sky-500 bg-sky-500 text-white hover:bg-sky-400 cursor-pointer"
                                    >
                                        אישור
                                    </motion.button>
                                </>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    סגור
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}