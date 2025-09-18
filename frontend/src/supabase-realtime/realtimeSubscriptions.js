/**
 * Realtime Subscriptions for Supabase
 *
 * This module provides helper functions to subscribe to realtime changes in Supabase tables.
 * It abstracts channels for:
 *   • Lists (`List` table)
 *   • Items (`Item` table)
 * 
 * Requirements / Preconditions for Realtime:
 * - The Supabase project must have Realtime enabled for the Postgres tables.
 * - The tables (`List` and `Item`) should have replication enabled in Supabase.
 * - Supabase Auth / API Key must allow subscribing to the Realtime channels.
 * - The client must be connected to the internet to receive websocket updates.
 * - Table schema and column names in the database must match what is referenced here.
 */

import { supabase } from './supabaseClient';

/**
 * subscribeToLists
 *
 * Subscribes to realtime events on the `List` table.
 *
 * @param {Object} callbacks
 * @param {Function} callbacks.onInsert Called with new row when a list is inserted
 * @param {Function} callbacks.onUpdate Called with updated row when a list is updated
 * @param {Function} callbacks.onDelete Called with old row when a list is deleted
 * @returns {Object} Supabase Realtime channel
 */
export function subscribeToLists({ onInsert, onUpdate, onDelete }) {
  const channel = supabase
    .channel('realtime-lists')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'List' },
      (payload) => {
        const { eventType, new: newRow, old } = payload;
        if (eventType === 'INSERT') onInsert?.(newRow);
        if (eventType === 'UPDATE') onUpdate?.(newRow);
        if (eventType === 'DELETE') onDelete?.(old);
      }
    )
    .subscribe();

  return channel;
}

/**
 * subscribeToItems
 *
 * Subscribes to realtime events for `Item` table of a specific list.
 *
 * @param {number|string} listId The ID of the list to monitor
 * @param {Object} callbacks
 * @param {Function} callbacks.onInsert Called with new row when an item is inserted
 * @param {Function} callbacks.onUpdate Called with updated row when an item is updated
 * @param {Function} callbacks.onDelete Called with old row when an item is deleted
 * @returns {Object} Supabase Realtime channel
 */
export function subscribeToItems(listId, callbacks) {
  const channel = supabase
    .channel('realtime-items')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Item', filter: `listId=eq.${listId}` },
      (payload) => {
        const { eventType, new: newRow, old } = payload;
        switch (eventType) {
          case 'INSERT':
            callbacks.onInsert?.(newRow);
            break;
          case 'UPDATE':
            callbacks.onUpdate?.(newRow);
            break;
          case 'DELETE':
            callbacks.onDelete?.(old);
            break;
        }
      }
    )
    .subscribe()
    .on('error', (err) => {
      // Handle errors if needed
      console.error("Realtime channel error:", err);
    })
    .on('close', () => {
      // Optional cleanup or logging
    });

  return channel;
}

/**
 * subscribeToSpecificItems
 *
 * Subscribes to realtime events for multiple lists at once.
 * Uses a Supabase `IN` filter on list IDs.
 *
 * @param {Array<number|string>} listIds List of IDs to monitor
 * @param {Object} callbacks { onInsert, onUpdate, onDelete }
 * @returns {Object} Supabase Realtime channel (with unsubscribe)
 */
export function subscribeToSpecificItems(listIds, callbacks) {
  if (listIds.length === 0) {
    return { unsubscribe: () => {} }; // Return a dummy channel if no lists
  }

  const filterString = `listId=in.(${listIds.join(',')})`;

  const channel = supabase
    .channel('realtime-specific-items')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Item', filter: filterString },
      (payload) => {
        const { eventType, new: newRow, old } = payload;
        switch (eventType) {
          case 'INSERT':
            callbacks.onInsert?.(newRow);
            break;
          case 'UPDATE':
            callbacks.onUpdate?.(newRow);
            break;
          case 'DELETE':
            callbacks.onDelete?.(old);
            break;
        }
      }
    )
    .subscribe();

  return channel;
}

// Re-export supabase client for convenience
export { supabase };