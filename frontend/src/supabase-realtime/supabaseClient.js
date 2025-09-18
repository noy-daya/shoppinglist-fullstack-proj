/**
 * Supabase Client
 *
 * This module initializes and exports a Supabase client for use across the app.
 *
 * - The exported `supabase` object is used to:
 *   • Perform queries on tables (SELECT, INSERT, UPDATE, DELETE)
 *   • Subscribe to realtime updates
 *   • Authenticate users (if needed)
 */

import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key, loaded from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);