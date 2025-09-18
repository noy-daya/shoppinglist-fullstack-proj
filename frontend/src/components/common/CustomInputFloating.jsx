import { useState } from "react";

/**
 * CustomInputFloating component
 * A floating-label input component supporting text, number, and other types.
 * Includes validation display, maxLength counter, and optional error tooltips.
 *
 * Props:
 * - id: Unique ID for the input and label
 * - label: Label text displayed above the input
 * - type: Input type (text, number, etc.), defaults to "text"
 * - value: Current value of the input
 * - onChange: Callback function triggered when the input value changes
 * - required: Marks the field as required if true
 * - min: Minimum value (for number inputs)
 * - maxLength: Maximum allowed length for text input
 * - step: Step increment for number inputs
 * - error: Error message to display (new prop)
 * - isErrorTooltip: If true, error messages are shown as tooltips instead of inline text (new prop)
 */
export default function CustomInputFloating({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  min,
  maxLength,
  step,
  error = "",   // Error message
  isErrorTooltip = false, // Display error as tooltip
}) {
  const [focused, setFocused] = useState(false); // Track input focus
  const length = value?.length || 0;            // Current input length for maxLength display

  return (
    <div
      className={`relative w-full font-huninn ${isErrorTooltip && error ? "tooltip tooltip-left tooltip-error" : ""
        }`}
      data-tip={isErrorTooltip ? error : ""}
    >
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        min={min}
        maxLength={maxLength}
        step={step}
        placeholder=" " // Placeholder is empty for floating label effect
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2.5 text-md text-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-sky-600 ${error ? "border-red-500" : ""
          }`}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute origin-top-right right-0 top-4 z-10 origin-center -translate-y-4 scale-75 transform text-md text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-85"
      >
        {label}
      </label>

      {/* Character count below input when focused */}
      {maxLength && focused && (
        <span className="absolute bottom-1 left-2 text-[10px] text-gray-400 bg-white px-1 rounded z-10 pointer-events-none">
          {length}/{maxLength}
        </span>
      )}

      {/* Inline error message */}
      {!isErrorTooltip && error && (
        <span className="absolute right-0 text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}
