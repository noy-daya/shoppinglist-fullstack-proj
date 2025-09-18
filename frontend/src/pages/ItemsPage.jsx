// React & Hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Icons
import { List } from "lucide-react";

// Components
import CategorySidebar from "../components/items/CategorySidebar";
import AddItem from "../components/items/AddItem";
import Items from "../components/items/Items";
import SortingAndFilters from "../components/items/SortingAndFilters";
import OperationsMenu from "../components/common/OperationsMenu";

// Hooks
import { useItems } from "../hooks/useItems";

/**
 * ItemsPage
 * Page for managing items within a selected list
 */
export default function ItemsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const list = state?.list;
  const listId = list?.id || params.listId;
  const initialCategoryId = state?.selectedCategoryId;

  const {
    itemsState,
    setSelectedCategory,
    errors,
    loadInitialData,
    handleFieldUpdate,
    handleAddItem,
    handleSave,
    handleDeleteItem,
    handleBought,
    nameOrderAsc,
    setNameOrderAsc,
    showBought,
    setShowBought,
    showNotBought,
    setShowNotBought,
  } = useItems(listId);

  // UI state for sidebar, drawer, scroll
  const [uiExtras, setUiExtras] = useState({
    sidebarExpanded: true,
    drawerOpen: false,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // --- Initial load ---
  useEffect(() => {
    if (!list) navigate("/");
    else loadInitialData(initialCategoryId);
  }, [list, navigate, loadInitialData, initialCategoryId]);

  const currentCategoryId = itemsState.selectedCategory?.id;

  const toggleSidebar = () =>
    setUiExtras((prev) => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));

  // --- Filter items by search ---
  const filteredItems =
    currentCategoryId && itemsState.itemsByCategory[currentCategoryId]
      ? itemsState.itemsByCategory[currentCategoryId].filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <div className="flex font-huninn">
      {/* Sidebar */}
      <CategorySidebar
        categories={itemsState.categories}
        selectedCategory={itemsState.selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchTerm("");
        }}
        sidebarExpanded={uiExtras.sidebarExpanded}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <main className="relative p-4 md:p-6 mr-4 space-y-6 flex-1 rounded-xl">
        {/* title */}
        <div className="flex flex-wrap gap-2 mb-4">
          {list?.name && (
            <span className="flex items-center gap-2 bg-gradient-to-l from-sky-600 via-sky-500 to-sky-400 text-white text-md font-semibold px-3 py-1 rounded-full shadow-md">
              <List size={20} className="opacity-90" />
              {list.name}
            </span>
          )}
          {itemsState.selectedCategory?.name && (
            <span className="bg-gradient-to-l from-sky-400 to-sky-300 text-white text-md font-semibold px-3 py-1 rounded-full shadow-md">
              {itemsState.selectedCategory.name}
            </span>
          )}
        </div>

        {/* Sorting & Filters */}
        <SortingAndFilters
          nameOrderAsc={nameOrderAsc}
          setNameOrderAsc={setNameOrderAsc}
          showBought={showBought}
          setShowBought={setShowBought}
          showNotBought={showNotBought}
          setShowNotBought={setShowNotBought}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentCategoryId={currentCategoryId}
        />

        {/* Global operations menu */}
        <OperationsMenu
          onAddClick={() => setUiExtras((prev) => ({ ...prev, drawerOpen: true }))}
          list={{ ...list, categories: itemsState.categories, units: itemsState.units }}
          showItems={["plus", "stats", "download"]}
        />

        {/* Add item drawer */}
        <AddItem
          listId={listId}
          drawerOpen={uiExtras.drawerOpen}
          onClose={() => setUiExtras((prev) => ({ ...prev, drawerOpen: false }))}
          units={itemsState.units}
          onAdd={handleAddItem}
        />

        {/* Items */}
        <Items
          items={filteredItems}
          units={itemsState.units}
          handleFieldUpdate={handleFieldUpdate}
          handleSave={handleSave}
          handleDelete={handleDeleteItem}
          handleBought={handleBought}
          fieldErrors={errors}
          loading={
            !filteredItems.length && itemsState.categories.length === 0
          }
        />
      </main>
    </div>
  );
}
