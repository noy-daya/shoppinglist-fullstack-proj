import { useState } from "react";
import { useNavigate } from "react-router-dom";

import chroma from "chroma-js"; //  Library to generate color scales for the pie chart categories.

// Components
import PieChart from "./Pie";
import CategoryLegend from "./CategoryLegend";
import ListProperties from "./ListProperties";
import CategoryLegendButton from "./CategoryLegendButton";

/**
 * ListChart
 *
 * Renders a pie chart for a shopping list with category breakdown.
 * Displays list properties, category legend (desktop), and a floating mobile
 * button to show the legend popup (mobile).
 *
 * Props:
 * - list (object): The shopping list metadata (id, name, etc.).
 * - listData (object): Contains category data, total quantity, and items for the list.
 *
 * Behavior:
 * - Highlights a category slice when clicked.
 * - Desktop shows a persistent legend; mobile uses a floating button popup.
 * - Clicking a category in legend navigates to the items page for that category.
 * - If no data exists, shows a message instead of chart.
 */
export default function ListChart({ list, listData }) {
  const navigate = useNavigate();
  const [highlightCategoryId, setHighlightCategoryId] = useState(null);

  // Determine if the list has valid data to display
  const hasData = listData && listData.categories?.length && listData.totalQuantity > 0;

  // Generate color scale for categories
  const scale = hasData
    ? chroma.scale(["rgb(85, 201, 247)", "rgb(241, 253, 63)"])
        .mode("lch")
        .colors(listData.categories.length)
    : [];

  // Map category IDs to colors for consistency across desktop and mobile
  const categoryColorMap = hasData
    ? Object.fromEntries(listData.categories.map((c, i) => [c.categoryId, scale[i]]))
    : {};

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 rounded-3xl bg-white/70 shadow-inner">
      {/* List summary */}
      <ListProperties list={list} totalQuantity={listData?.totalQuantity || 0} />

      {!hasData ? (
        /* No data placeholder */
        <div className="flex justify-center items-center w-full h-[320px] md:h-[500px]">
          <p className="text-center text-gray-500 mb-10">
            אין נתונים להצגה ברשימה זו.
          </p>
        </div>
      ) : (
        <>
          {/* Main chart with desktop legend */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col md:flex-row gap-6 max-w-5xl w-full">
              
              {/* Pie chart */}
              <div className="flex-1 flex justify-center items-center">
                <div className="w-full max-w-[500px] h-[320px] md:h-[500px]">
                  <PieChart
                    listData={listData}
                    categoryColorMap={categoryColorMap}
                    highlightCategoryId={highlightCategoryId}
                    onSliceClick={(categoryId) =>
                      setHighlightCategoryId(prev =>
                        prev === categoryId ? null : categoryId
                      )
                    }
                  />
                </div>
              </div>

              {/* Desktop category legend */}
              <div className="hidden md:block shrink-0">
                <CategoryLegend
                  categories={listData.categories}
                  categoryColorMap={categoryColorMap}
                  highlightCategoryId={highlightCategoryId}
                  onCategoryClick={(categoryId) =>
                    navigate(`/items-page/${list.id}`, {
                      state: { list: listData, selectedCategoryId: categoryId },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Mobile legend floating button */}
          <CategoryLegendButton
            listId={list.id}
            listData={listData}
            categoryColorMap={categoryColorMap} // Colors match desktop
            highlightCategoryId={highlightCategoryId}
            setHighlightCategoryId={setHighlightCategoryId}
            navigate={navigate}
          />
        </>
      )}
    </div>
  );
}