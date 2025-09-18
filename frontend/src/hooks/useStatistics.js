// React & Hooks
import { useState, useEffect, useCallback, useRef } from "react";

// API
import { fetchMonthlyStats, fetchListStats } from "../api/statistics";

// Realtime
import { subscribeToLists, subscribeToSpecificItems } from "../supabase-realtime/realtimeSubscriptions";

// Context
import { useErrorHandler } from "../context/ErrorContext";

/**
 * recalcList
 * Recalculates category percentages and total quantity for a list.
 *
 * @param {Object} listData - List data object containing `categories`
 * @returns {Object} - Updated list data with `percent` in each category and totalQuantity
 */
function recalcList(listData) {
  const totalQuantity = (listData.categories || []).reduce(
    (sum, c) => sum + (c.quantity || 0),
    0
  );

  const updatedCategories = (listData.categories || []).map((c) => ({
    ...c,
    percent: totalQuantity ? (c.quantity / totalQuantity) * 100 : 0,
  }));

  return { ...listData, categories: updatedCategories, totalQuantity };
}

/**
 * useStatistics
 * Custom hook for managing statistics for shopping lists.
 *
 * Features:
 * - Loads monthly statistics from the API.
 * - Stores per-list data in `dataByList`, with category percentages.
 * - Supports highlighting a month and reactive reloading.
 * - Subscribes to real-time updates for lists and items using Supabase.
 * - Handles insert, update, and delete events for lists and items.
 * - Provides helper functions to reload all lists or individual lists.
 *
 * Parameters:
 * - initialMonth - Initial month in format "YYYY-MM" to load stats
 * Returns:
 *   - month: currently selected month
 *   - setMonth: setter for the month
 *   - lists: array of lists for the month
 *   - dataByList: object mapping listId → recalculated list data
 *   - loading: boolean indicating loading state
 *   - reloadMonth: function to reload all data for current month
 *   - reloadList: function to reload a specific list
 */
export function useStatistics(initialMonth) {
  const [month, setMonth] = useState(initialMonth);
  const [lists, setLists] = useState([]);
  const [dataByList, setDataByList] = useState({});
  const [loading, setLoading] = useState(true);

  const { showError } = useErrorHandler();
  const itemChannelsRef = useRef({});

  /**
   * loadMonthData
   * Fetch statistics for the given month and recalculate categories
   */
  const loadMonthData = useCallback(
    async (m) => {
      setLoading(true);
      try {
        const monthData = await fetchMonthlyStats(m);
        const monthLists = monthData.lists || [];
        setLists(monthLists);

        const newDataByList = {};
        monthLists.forEach((list) => {
          newDataByList[list.id] = recalcList(list);
        });
        setDataByList(newDataByList);
      } catch (err) {
        console.error(err);
        showError(err, "שגיאה בטעינת סטטיסטיקות");
        setLists([]);
        setDataByList({});
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  /**
   * reloadList
   * Fetch statistics for a specific list and update state
   */
  const reloadList = useCallback(
    async (listId) => {
      try {
        const updatedList = await fetchListStats(listId, month);
        setDataByList((prev) => ({
          ...prev,
          [listId]: recalcList(updatedList),
        }));
      } catch (err) {
        console.error(err);
        showError(err, "שגיאה ברענון רשימה");
      }
    },
    [month, showError]
  );

  // --- Load initial data / react to month changes ---
  useEffect(() => {
    if (!month) return;
    loadMonthData(month);
  }, [month, loadMonthData]);

  // --- Real-time subscription for lists ---
  useEffect(() => {
    const channel = subscribeToLists({
      onInsert: (newList) => {
        setLists((prev) => [...prev, newList]);
        setDataByList((prev) => ({
          ...prev,
          [newList.id]: recalcList(newList),
        }));
      },
      onUpdate: (updatedList) => {
        setLists((prev) =>
          prev.map((l) => (l.id === updatedList.id ? updatedList : l))
        );
        setDataByList((prev) => {
          const prevData = prev[updatedList.id] || {};
          const merged = { ...prevData, ...updatedList };
          return { ...prev, [updatedList.id]: recalcList(merged) };
        });
      },
      onDelete: (deletedList) => {
        setLists((prev) => prev.filter((l) => l.id !== deletedList.id));
        setDataByList((prev) => {
          const copy = { ...prev };
          delete copy[deletedList.id];
          return copy;
        });

        if (itemChannelsRef.current[deletedList.id]) {
          itemChannelsRef.current[deletedList.id].unsubscribe();
          delete itemChannelsRef.current[deletedList.id];
        }
      },
    });

    return () => channel.unsubscribe();
  }, []);

  /**
   * updateItemInData
   * Updates a specific item in dataByList according to type (insert/update/delete)
   */
  const updateItemInData = useCallback(
    (listId, item, type) => {
      setDataByList((prev) => {
        const listData = prev[listId];
        if (!listData) return prev;

        let updatedCategories = [...listData.categories];
        const categoryId = item.categoryId;
        const idx = updatedCategories.findIndex(
          (c) => c.categoryId === categoryId
        );
        let shouldReload = false;

        switch (type) {
          case "insert":
            if (idx > -1) {
              updatedCategories[idx] = {
                ...updatedCategories[idx],
                quantity: (updatedCategories[idx].quantity || 0) + 1,
              };
            } else {
              shouldReload = true;
            }
            break;
          case "update":
            if (idx === -1) shouldReload = true;
            break;
          case "delete":
            if (idx > -1) {
              const newQty = Math.max(
                0,
                (updatedCategories[idx].quantity || 0) - 1
              );
              if (newQty > 0)
                updatedCategories[idx] = {
                  ...updatedCategories[idx],
                  quantity: newQty,
                };
              else updatedCategories.splice(idx, 1);
            }
            break;
        }

        if (shouldReload) {
          reloadList(listId);
          return prev;
        }

        const updatedList = recalcList({
          ...listData,
          categories: updatedCategories,
        });
        return { ...prev, [listId]: updatedList };
      });
    },
    [reloadList]
  );

  // --- Real-time subscription for items in all lists ---
  useEffect(() => {
    const listIds = lists.map((list) => list.id);
    if (listIds.length === 0) return;

    const channel = subscribeToSpecificItems(listIds, {
      onInsert: (item) => updateItemInData(item.listId, item, "insert"),
      onUpdate: (item) => updateItemInData(item.listId, item, "update"),
      onDelete: (item) => updateItemInData(item.listId, item, "delete"),
    });

    return () => channel.unsubscribe();
  }, [lists, updateItemInData]);

  return {
    month,
    setMonth,
    lists,
    dataByList,
    loading,
    reloadMonth: () => loadMonthData(month),
    reloadList,
  };
}