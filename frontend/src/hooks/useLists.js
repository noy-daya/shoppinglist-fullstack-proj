// React & Hooks
import { useState, useEffect, useCallback } from "react";

// API
import { fetchLists, createList, updateList, deleteList } from "../api/lists";

// Validation
import { validateListUpdate } from "../validators/listValidator";

// Realtime
import { supabase } from "../supabase-realtime/supabaseClient";
import { subscribeToLists } from "../supabase-realtime/realtimeSubscriptions";

// Context
import { useErrorHandler } from "../context/ErrorContext"; // for success/error notifications

/**
 * useLists
 * 
 * Custom hook for managing shopping lists.
 *
 * Features:
 * - Fetches initial lists from API.
 * - Subscribes to real-time updates via Supabase.
 * - Updates individual list fields locally with validation.
 * - Supports creating, updating, and deleting lists with success/error notifications.
 * - Maintains loading and validation state.
 *
 * Returns:
 * - lists: Array of lists
 * - isLoading: Boolean loading indicator
 * - errors: Validation errors keyed by list ID
 * - handleFieldUpdate(index, field, value): Updates a list field locally with validation
 * - handleSave(list): Saves an updated list via API
 * - handleDelete(listId): Deletes a list by ID
 * - handleCreate(name): Creates a new list
 * - loadLists(): Reloads all lists from API
 */
export function useLists() {
  // Array of lists fetched from API / realtime
  const [lists, setLists] = useState([]);

  // Whether the lists are currently loading
  const [isLoading, setIsLoading] = useState(true);

  // Holds validation errors per list ID
  const [errors, setErrors] = useState({});

  const { showError, showSuccess } = useErrorHandler();

  /**
   * Load lists from API
   * Also used after creating a new list to refresh data
   */
  const loadLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLists();
      setLists(data);
    } catch (err) {
      showError(err); // הודעת שגיאה בעברית כבר מוגדרת בתוך showError
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  /**
   * Initial fetch and realtime subscription
   */
  useEffect(() => {
    loadLists();

    const channel = subscribeToLists({
      onInsert: (newList) => setLists((prev) => [newList, ...prev]),
      onUpdate: (updatedList) =>
        setLists((prev) =>
          prev.map((l) => (l.id === updatedList.id ? updatedList : l))
        ),
      onDelete: (deletedList) =>
        setLists((prev) => prev.filter((l) => l.id !== deletedList.id)),
    });

    return () => supabase.removeChannel(channel);
  }, [loadLists]);

  /**
   * Update a field of a list locally, with validation
   */
  const handleFieldUpdate = (index, field, value) => {
    setLists((prev) => {
      const newLists = [...prev];
      newLists[index] = { ...newLists[index], [field]: value };

      const listErrors = validateListUpdate(newLists[index]);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (Object.keys(listErrors).length > 0)
          newErrors[newLists[index].id] = listErrors;
        else delete newErrors[newLists[index].id];
        return newErrors;
      });

      return newLists;
    });
  };

  // --- CRUD operations ---

  /**
   * handleSave
   * Saves updates to an existing list.
   *
   * Steps:
   * 1. Validate the updated list locally.
   * 2. If validation fails, store errors in state and stop.
   * 3. Call the API to update the list.
   * 4. Update the list in local state.
   * 5. Show success or error notification.
   */
  const handleSave = async (list) => {
    const listErrors = validateListUpdate(list);
    if (Object.keys(listErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [list.id]: listErrors }));
      return;
    }
    try {
      const updated = await updateList(list.id, { name: list.name });
      setLists((prev) =>
        prev.map((l) => (l.id === updated.id ? { ...l, name: updated.name } : l))
      );
      showSuccess("שינויים נשמרו בהצלחה.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * handleDelete
   * Deletes a list by its ID.
   *
   * Steps:
   * 1. Call the API to delete the list.
   * 2. Remove the list from local state.
   * 3. Show success or error notification.
   */
  const handleDelete = async (listId) => {
    try {
      await deleteList(listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
      showSuccess("הרשימה נמחקה בהצלחה.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * handleCreate
   * Creates a new list.
   *
   * Steps:
   * 1. Validate the new list locally.
   * 2. If validation fails, store errors in state and stop.
   * 3. Call the API to create the list.
   * 4. Show success notification.
   * 5. Reload all lists to refresh state.
   */
  const handleCreate = async (name) => {
    const newList = { name };
    const listErrors = validateListUpdate(newList);
    if (Object.keys(listErrors).length > 0) {
      setErrors((prev) => ({ ...prev, temp: listErrors }));
      return;
    }
    try {
      await createList(name);
      showSuccess("הרשימה נוצרה בהצלחה.");
      await loadLists(); // Refresh lists
    } catch (err) {
      showError(err);
    }
  };


  return {
    lists,
    isLoading,
    errors,
    handleFieldUpdate,
    handleSave,
    handleDelete,
    handleCreate,
    loadLists,
  };
}