import pdfMake from "pdfmake/build/pdfmake"; // Library for making pdf files

// Fonts
// * note that the actual tts files are not included in the project at all,
//   instead it uses base64 constants of files as mentioned below)
import { ASSISTANT_FONT_BASE64, ASSISTANT_BOLD_FONT_BASE64 } from "./constants";

/**
 * pdfUtilsPdfMake.js
 *
 * Utility functions for generating PDF files using `pdfMake` with full Hebrew (RTL) support.
 *
 * Features:
 * - Registers Assistant font (regular + bold) from base64 and sets it as the default font.
 * - Provides RTL helpers for text and rows to ensure proper alignment and spacing.
 * - Maps shopping list state (categories + items) into a structured format ready for PDF.
 * - Generates styled PDF documents with headers, subheaders, and item tables.
 *
 * Usage:
 * - `generatePdfFromList(list)` → generates and downloads a PDF file for a given list.
 *
 * Dependencies:
 * - pdfMake
 * - Assistant font (Regular, Bold) embedded as base64
 */

// --- Font setup ---
// Register Assistant font in Virtual File System (VFS)
pdfMake.vfs = {
  "Assistant-Regular.ttf": ASSISTANT_FONT_BASE64,
  "Assistant-Bold.ttf": ASSISTANT_BOLD_FONT_BASE64,
};

// Define font family for pdfMake
pdfMake.fonts = {
  Assistant: {
    normal: "Assistant-Regular.ttf",
    bold: "Assistant-Bold.ttf",
    italics: "Assistant-Regular.ttf",
    bolditalics: "Assistant-Regular.ttf",
  },
};

/**
 * rtlText
 * Helper for creating RTL-aligned text with non-breaking spaces.
 *
 * @param {string} text - The text to render.
 * @param {object} options - Optional style overrides (e.g., { bold: true, style: "header" }).
 * @returns {object} pdfMake text object with RTL alignment.
 */
function rtlText(text, options = {}) {
  if (!text) text = "";
  // \u00A0 = non-breaking space לשמירת רווחים בין מילים
  return { text: text.split(" ").join("\u00A0"), alignment: "right", ...options };
}

/**
 * rtlRow
 * Converts a row of plain strings into a row of RTL-aligned text objects.
 *
 * @param {Array<string|object>} row - Array of cell values.
 * @returns {Array<object>} Row formatted for pdfMake table body.
 */
function rtlRow(row) {
  return row.map(cell => (typeof cell === "string" ? rtlText(cell) : cell));
}

/**
 * generatePdfFromList
 * Generates and downloads a PDF file for the given shopping list.
 *
 * Features:
 * - Adds a main title (list name).
 * - Renders each category as a subheader.
 * - Displays items in tables with columns: שם, מותג, כמות, יחידה, הערות.
 * - Supports RTL layout and Assistant font.
 *
 * @param {object} list - Normalized list object from `mapItemsStateToList`.
 * @returns {void} Triggers a PDF download named after the list.
 */
export function generatePdfFromList(list) {
  if (!list || !Array.isArray(list.categories) || list.categories.length === 0) return;

  const content = [];

  // print list title
  content.push(rtlText(list.name || "רשימה", { style: "header", bold: true, margin: [0, 0, 0, 20] }));

  // iterate through each category
  list.categories.forEach(cat => {
    const items = Array.isArray(cat.items) ? cat.items : [];

    // print category name
    content.push(rtlText(cat.name || "", { style: "subheader", bold: true, margin: [0, 10, 0, 5] }));

    // print table headers
    const tableBody = [
      rtlRow(["הערות", "יחידה", "כמות", "מותג", "שם"]), // כותרת

      // print items
      ...items.map(item =>
        rtlRow([item.comments, item.unit, item.quantity, item.brand, item.name])
      ),
    ];

    content.push({
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto", "*"],
        body: tableBody,
      },
      layout: "lightHorizontalLines",
      style: "table",
    });
  });

  const docDefinition = {
    content,
    defaultStyle: { font: "Assistant" },
    styles: {
      header: { fontSize: 22, bold: true },
      subheader: { fontSize: 16, bold: true },
      table: { fontSize: 12 },
    },
    pageMargins: [40, 60, 40, 60],
    rtl: true,
  };

  pdfMake.createPdf(docDefinition).download(`${list.name || "רשימה"}.pdf`);
}