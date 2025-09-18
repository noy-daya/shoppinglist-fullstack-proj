import { useState } from "react";

/**
 * CustomInput component
 * A flexible input component supporting text and number types,
 * with validation display, maxLength counter, and dynamic field updates.
 *
 * Props:
 * - itemId (optional): ID of the item being edited (for item-based updates)
 * - index (optional): Index of the item in a list (for list-based updates)
 * - field: The name/key of the field being updated
 * - type: Input type, defaults to "text"
 * - value: Current value of the input
 * - placeholder: Placeholder text for the input
 * - maxLength: Maximum allowed length for text input
 * - min: Minimum value for number input
 * - fieldErrors: Object containing field-specific error messages
 * - updateField: Callback function to update the field value
 * - isErrorTooltip: If true, error messages are shown as tooltips instead of inline text
 */
export default function CustomInput({
  itemId,
  index,
  field,
  type = "text",
  value,
  placeholder = "",
  maxLength,
  min,
  fieldErrors = {},
  handleFieldUpdate,
  isErrorTooltip = false
}) {
  const [focused, setFocused] = useState(false); // Track if input is focused
  const length = value?.length || 0;            // Current input length for maxLength display
  const errorMsg = fieldErrors[field] || "";         // Error message for this field

  /**
   * Handle input value changes
   * Converts to number if type="number", then calls handleFieldUpdate callback
   * Uses either itemId (for items) or index (for lists) to update value
   */
  const handleChange = (e) => {
    const val = type === "number" ? Number(e.target.value) : e.target.value;
    if (handleFieldUpdate) {
      if (itemId !== undefined) {
        handleFieldUpdate(itemId, field, val);   // Update by itemId
      } else if (typeof index !== "undefined") {
        handleFieldUpdate(index, field, val);    // Update by index
      }
    }
  };

  return (
    <div
      className={`flex flex-col w-full ${
        isErrorTooltip && errorMsg ? "tooltip tooltip-left tooltip-error" : ""
      }`}
      data-tip={isErrorTooltip ? errorMsg : ""}
    >
      <div className="relative w-full">
        <input
          name={field}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          className={`input input-md w-full ${errorMsg ? "input-error" : ""}`}
          autoComplete="off"
        />

        {/* Show character count when focused and maxLength is set */}
        {maxLength && focused && (
          <span className="absolute bottom-1 left-2 text-[10px] text-gray-400 bg-white px-1 rounded z-10 pointer-events-none">
            {length}/{maxLength}
          </span>
        )}
      </div>

      {/* Inline error message (shown only if not using tooltip) */}
      {!isErrorTooltip && errorMsg && (
        <span className="text-xs text-red-500 mt-1">{errorMsg}</span>
      )}
    </div>
  );
}
