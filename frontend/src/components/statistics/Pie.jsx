import { Chart } from "react-google-charts"; //  Library for charts

/**
 * PieChart
 * 
 * Renders a responsive Pie chart for a list's categories using `react-google-charts`.
 * Supports highlighting a specific category and custom tooltips.
 * 
 * Props:
 * - listData: Object
 *   - Contains `categories` (array of category objects with `categoryId`, `categoryName`, `quantity`, `percent`) 
 *     and total quantities.
 * - categoryColorMap: Object
 *   - Maps categoryId → hex color string. Used to consistently color chart slices.
 * - highlightCategoryId: string | number | null
 *   - Optional. If set, only this category is fully opaque, others are dimmed.
 * - onSliceClick: Function
 *   - Callback fired when a slice is clicked. Receives the clicked categoryId.
 * 
 * Features:
 * - Generates chart data with custom HTML tooltips.
 * - Offsets the highlighted slice slightly from the chart.
 */

export default function PieChart({
  listData,
  categoryColorMap,
  highlightCategoryId,
  onSliceClick,
}) {
  const chartData = [
    [
      "Category",
      "Percent",
      { role: "tooltip", type: "string", p: { html: true } },
      { role: "style" },
    ],
    ...listData.categories.map((c) => {
      const opacity =
        !highlightCategoryId || highlightCategoryId === c.categoryId ? 1 : 0.3;

      const tooltipHtml = `
        <div style="
          font-family: 'Huninn', Arial, sans-serif; 
          font-size: 14px;
          text-align:center;
        ">
          ${c.categoryName} (${c.quantity})
        </div>
      `;

      return [
        c.categoryName,                
        c.percent,                     
        tooltipHtml,
        `color: ${categoryColorMap[c.categoryId]}; opacity: ${opacity}`,
      ];
    }),
  ];

  const slices = {};
  listData.categories.forEach((c, idx) => {
    slices[idx] = { offset: highlightCategoryId === c.categoryId ? 0.08 : 0 };
  });

  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={{
        pieHole: 0.45,
        pieSliceText: "percentage",
        pieSliceTextStyle: {
          fontName: "Huninn",
          fontSize: 14,
          bold: true,
        },
        legend: "none",
        colors: listData.categories.map((c) => categoryColorMap[c.categoryId]),
        chartArea: { width: "100%", height: "90%" },
        backgroundColor: "transparent",
        tooltip: { isHtml: true, trigger: "focus" },
        slices,
      }}
      width="100%"
      height="100%"
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper.getChart();
            const selection = chart.getSelection();
            if (selection.length > 0) {
              const selectedRow = selection[0].row;
              const categoryId = listData.categories[selectedRow].categoryId;
              onSliceClick(categoryId);
            }
          },
        },
      ]}
    />
  );
}