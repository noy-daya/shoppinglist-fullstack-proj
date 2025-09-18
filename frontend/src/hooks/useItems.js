// React & Hooks
import { useState, useEffect, useCallback } from "react";

// API
import { fetchCategories } from "../api/categories";
import { fetchUnits } from "../api/units";
import { fetchItems, addItem, updateItem, deleteItem } from "../api/items";

// Validation
import { validateItemUpdate } from "../validators/itemValidator";

// Realtime
import { supabase } from "../supabase-realtime/supabaseClient";
import { subscribeToItems } from "../supabase-realtime/realtimeSubscriptions";

// Context
import { useErrorHandler } from "../context/ErrorContext";

/**
 * useItems
 *
 * Custom hook for managing items within a specific list.
 *
 * Features:
 * - Fetches categories, units, and items from API.
 * - Subscribes to realtime updates for items in the list via Supabase.
 * - Supports filtering and sorting of items by name and bought status.
 * - Provides functions to add, update, and delete items with validation.
 * - Maintains UI state: loading, error messages, filtered items, and validation errors.
 *
 * Parameters:
 * - listId: ID of the list for which to manage items
 *
 * Returns:
 * - items: Array of items in the list
 * - categories: Array of categories
 * - units: Array of units
 * - filteredItems: Items filtered based on search & bought status
 * - isLoading: Boolean loading indicator
 * - errors: Validation errors keyed by item ID
 * - handleFieldUpdate(index, field, value): Update a field of an item locally with validation
 * - handleSave(item): Saves an updated item via API
 * - handleDelete(itemId): Deletes an item by ID
 * - handleAdd(item): Adds a new item with validation
 * - reloadItems(): Reloads items from API
 */
export function useItems(listId) {
  const [itemsState, setItemsState] = useState({
    categories: [],
    selectedCategory: null,
    itemsByCategory: {},
    units: [],
  });
  const [uiState, setUiState] = useState({ loading: true, error: "" });
  const [errors, setErrors] = useState({});
  const [nameOrderAsc, setNameOrderAsc] = useState(true);
  const [showBought, setShowBought] = useState(true);
  const [showNotBought, setShowNotBought] = useState(true);

  const { showError, showSuccess } = useErrorHandler();

  // --- Sort & filter items by name and bought status ---
  const sortItems = useCallback(
    (itemsArray) => {
      if (!itemsArray) return [];
      return [...itemsArray]
        .filter(
          (item) =>
            (item.bought && showBought) || (!item.bought && showNotBought)
        )
        .sort((a, b) =>
          nameOrderAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
    },
    [nameOrderAsc, showBought, showNotBought]
  );

  // --- Load categories & units ---
  const loadInitialData = useCallback(
    async (initialSelectedCategoryId = null) => {
      setUiState((prev) => ({ ...prev, loading: true }));
      try {
        const [cats, units] = await Promise.all([fetchCategories(), fetchUnits()]);
        setItemsState((prev) => {
          const selected = initialSelectedCategoryId
            ? cats.find((c) => c.id === initialSelectedCategoryId) || cats[0] || null
            : prev.selectedCategory || cats[0] || null;
          return { ...prev, categories: cats, units, selectedCategory: selected };
        });
      } catch (err) {
        showError(err);
      } finally {
        setUiState((prev) => ({ ...prev, loading: false }));
      }
    },
    [showError]
  );

  // --- Load items for a specific category ---
  const loadItems = useCallback(
    async (categoryId) => {
      if (!categoryId) return;
      setUiState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await fetchItems(listId, categoryId);
        setItemsState((prev) => ({
          ...prev,
          itemsByCategory: { ...prev.itemsByCategory, [categoryId]: sortItems(data) },
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          data.forEach((item) => (newErrors[item.id] = {}));
          return newErrors;
        });
        setUiState((prev) => ({ ...prev, error: "" }));
      } catch (err) {
        showError(err);
      } finally {
        setUiState((prev) => ({ ...prev, loading: false }));
      }
    },
    [listId, sortItems, showError]
  );

  // --- Load items when selected category changes ---
  useEffect(() => {
    if (itemsState.selectedCategory) loadItems(itemsState.selectedCategory.id);
  }, [itemsState.selectedCategory, loadItems]);

  // --- Realtime subscription to item changes ---
  useEffect(() => {
    if (!listId) return;
    const channel = subscribeToItems(listId, {
      onInsert: (newItem) => {
        setItemsState((prev) => {
          const currentItems = prev.itemsByCategory[newItem.categoryId] || [];
          return {
            ...prev,
            itemsByCategory: {
              ...prev.itemsByCategory,
              [newItem.categoryId]: sortItems([...currentItems, newItem]),
            },
          };
        });
      },
      onUpdate: (updatedItem) => {
        setItemsState((prev) => {
          const currentItems = prev.itemsByCategory[updatedItem.categoryId] || [];
          const newItems = currentItems.map((i) =>
            i.id === updatedItem.id ? updatedItem : i
          );
          return {
            ...prev,
            itemsByCategory: { ...prev.itemsByCategory, [updatedItem.categoryId]: sortItems(newItems) },
          };
        });
      },
      onDelete: (deletedItem) => {
        setItemsState((prev) => {
          const newItemsByCategory = { ...prev.itemsByCategory };
          Object.keys(newItemsByCategory).forEach((catId) => {
            newItemsByCategory[catId] = newItemsByCategory[catId].filter(
              (i) => i.id !== deletedItem.id
            );
          });
          return { ...prev, itemsByCategory: newItemsByCategory };
        });
      },
    });
    return () => supabase.removeChannel(channel);
  }, [listId, sortItems]);

  // --- Update item field locally with validation ---
  const handleFieldUpdate = (itemId, field, value) => {
    const currentCategoryId = itemsState.selectedCategory?.id;
    if (!itemId || !currentCategoryId) return;

    setItemsState((prev) => {
      const updated = (prev.itemsByCategory[currentCategoryId] || []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      );

      const updatedItem = updated.find((item) => item.id === itemId);
      const validationErrors = validateItemUpdate(updatedItem);

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (Object.keys(validationErrors).length > 0) newErrors[itemId] = validationErrors;
        else delete newErrors[itemId];
        return newErrors;
      });

      return {
        ...prev,
        itemsByCategory: { ...prev.itemsByCategory, [currentCategoryId]: sortItems(updated) },
      };
    });
  };

  // --- CRUD operations ---

  /**
   * handleAddItem
   * Adds a new item to the current selected category in the list.
   *
   * Steps:
   * 1. Validate the new item locally.
   * 2. If validation fails, store errors in state and stop.
   * 3. Call the API to add the item.
   * 4. Show success or error notification.
   */
  const handleAddItem = async (newItem) => {
    const currentCategoryId = itemsState.selectedCategory?.id;
    if (!currentCategoryId) return;

    const validationErrors = validateItemUpdate(newItem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, temp: validationErrors }));
      return;
    }

    try {
      await addItem(listId, currentCategoryId, newItem);
      showSuccess("המוצר נוסף בהצלחה.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * handleSave
   * Saves updates to an existing item.
   *
   * Steps:
   * 1. Validate the updated item locally.
   * 2. If validation fails, store errors in state and stop.
   * 3. Call the API to update the item.
   * 4. Show success or error notification.
   */
  const handleSave = async (item) => {
    const validationErrors = validateItemUpdate(item);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [item.id]: validationErrors }));
      return;
    }
    try {
      await updateItem(item.id, item);
      showSuccess("שינויים נשמרו בהצלחה.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * handleDeleteItem
   * Deletes an item by its ID.
   *
   * Steps:
   * 1. Get the current selected category.
   * 2. Call the API to delete the item.
   * 3. Reload items for the current category.
   * 4. Show success or error notification.
   */
  const handleDeleteItem = async (itemId) => {
    const currentCategoryId = itemsState.selectedCategory?.id;
    try {
      await deleteItem(itemId);
      if (currentCategoryId) await loadItems(currentCategoryId);
      showSuccess("המוצר נמחק בהצלחה.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * handleBought
   * Toggles the "bought" status of an item.
   *
   * Steps:
   * 1. Get the current selected category.
   * 2. Find the item locally.
   * 3. Update the "bought" field locally for immediate UI feedback.
   * 4. Call handleSave to persist the change in the API.
   * 5. Show error notification if saving fails.
   */
  const handleBought = async (itemId, bought) => {
    const currentCategoryId = itemsState.selectedCategory?.id;
    if (!currentCategoryId) return;

    const item = itemsState.itemsByCategory[currentCategoryId]?.find((i) => i.id === itemId);
    if (!item) return;

    handleFieldUpdate(itemId, "bought", bought);
    try {
      await handleSave({ ...item, bought });
    } catch (err) {
      showError(err);
    }
  };


  const setSelectedCategory = (category) => {
    setItemsState((prev) => ({ ...prev, selectedCategory: category }));
  };

  return {
    itemsState,
    uiState,
    errors,
    nameOrderAsc,
    setNameOrderAsc,
    showBought,
    setShowBought,
    showNotBought,
    setShowNotBought,
    loadInitialData,
    handleFieldUpdate,
    handleAddItem,
    handleSave,
    handleDeleteItem,
    setSelectedCategory,
    handleBought,
  };
}