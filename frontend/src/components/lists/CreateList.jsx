import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons & Animations
import { FaArrowLeft } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Components
import CustomInputFloating from "../common/CustomInputFloating";

// API & Validation
import { createList } from "../../api/lists";
import { validateListCreation } from "../../validators/listValidator";

// Context
import { useErrorHandler } from "../../context/ErrorContext"; // for success/error notifications

/**
 * CreateList
 * A form for creating a new shopping list.
 *
 * Features:
 * - Input field with live validation (via validateListCreation)
 * - Uses API call (createList) to save the list
 * - Error & success handling via ErrorContext
 * - Loading state with spinner when creating
 * - After creation, navigates automatically to ItemsPage
 */
export default function CreateList() {
  // The name of the list typed by the user
  const [name, setName] = useState("");

  // Whether a list creation request is currently loading
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  // Object holding validation errors (per field)
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { showError, showSuccess } = useErrorHandler();

  /**
   * Handles form submission
   * - Validates input
   * - Calls API to create list
   * - Shows notifications and redirects on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name before submit
    const validationErrors = validateListCreation(name);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoadingCreate(true);
    try {
      const data = await createList(name);
      showSuccess("הרשימה נוצרה בהצלחה!");
      // Redirect to items-page for the new list
      navigate(`/items-page/${data.id}`, { state: { list: data } });
    } catch (err) {
      showError(err, "שגיאה ביצירת רשימה");
    } finally {
      setIsLoadingCreate(false);
    }
  };

  return (
    <div className="max-w-sm p-2 font-huninn">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Input field with floating label */}
        <CustomInputFloating
          id="ListNameInput"
          label="שם הרשימה (אם ריק- נשתמש בתאריך הנוכחי)"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Live validation on change
            const validationErrors = validateListCreation(e.target.value);
            setErrors(validationErrors);
          }}
          maxLength={50}
          error={errors.name}
          isErrorTooltip={false}
        />

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isLoadingCreate}
          whileHover={{ scale: isLoadingCreate ? 1 : 1.03 }}
          whileTap={{ scale: isLoadingCreate ? 1 : 0.97 }}
          className="mt-10 bg-gradient-to-r from-sky-600 to-sky-500 
             text-white px-4 py-2 rounded-xl shadow-md 
             hover:shadow-lg transition-all cursor-pointer
             flex items-center justify-center gap-2 flex-row-reverse"
        >
          {/* Spinner while creating */}
          {isLoadingCreate && <Loader2 className="animate-spin w-4 h-4" />}

          <span className="text-md font-medium">
            {isLoadingCreate ? "יוצר..." : "המשך"}
          </span>

          {/* Arrow icon */}
          <FaArrowLeft
            size={14}
            className={`transition-transform ${!isLoadingCreate ? "group-hover:-translate-x-1" : ""}`}
          />
        </motion.button>
      </form>
    </div>
  );
}
