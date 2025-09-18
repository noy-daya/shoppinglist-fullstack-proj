// Material UI DatePicker and localization
import { DatePicker } from "@mui/x-date-pickers/DatePicker";           // Date picker component
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";   // Date adapter for date-fns
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Provides locale support

// Material UI theme utilities
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Date-fns locale for Hebrew
import { he } from "date-fns/locale";                                   

// Framer Motion for animations
import { motion } from "framer-motion";                                 

/**
 * CustomMonthPicker component
 * A month and year picker using MUI DatePicker with RTL support, custom theme, and framer-motion animations.
 *
 * Props:
 * - selectedDate: Currently selected date
 * - onMonthChange: Callback function triggered when the month is changed
 *
 * Features:
 * - Limits selectable dates from 2 years ago to next year
 */
const theme = createTheme({
  direction: "rtl", // Right-to-left layout
  typography: {
    fontFamily: "Huninn, Arial, sans-serif",
  },
});

export default function CustomMonthPicker({ selectedDate, onMonthChange }) {
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 2, 0, 1); // Minimum selectable date
  const nextYear = new Date(today.getFullYear() + 1, 11, 31);   // Maximum selectable date

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-white/70 backdrop-blur-sm shadow-md rounded-xl px-4 py-1 transition-all duration-200 cursor-pointer"
        style={{
          width: "200px",
          height: "100%",
          display: "inline-block",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
          <DatePicker
            views={["year", "month"]}        // Only year and month selection
            value={selectedDate}
            onChange={onMonthChange}
            minDate={twoYearsAgo}
            maxDate={nextYear}
            format="LLLL yyyy"               // Display format: Month Year
            slotProps={{
              popper: {
                disablePortal: false,
              },
              textField: {
                variant: "standard",
                fullWidth: true,
                InputProps: {
                  onKeyDown: (e) => e.preventDefault(), // Prevent manual typing
                },
                sx: {
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                    fontSize: 16,
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 0,
                    paddingRight: 4,
                  },
                  "& .MuiSvgIcon-root": {   // Arrow icon
                    color: "#0284c7",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </motion.div>
    </ThemeProvider>
  );
}