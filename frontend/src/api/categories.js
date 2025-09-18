// api/categories.js
import * as LucideIcons from "lucide-react";
import { request } from "./http";
import { API_CATEGORIES } from "../utils/constants";

/**
 * fetchCategories
 * Fetches the list of categories and maps Lucide icons.
 * 
 * @returns {Promise<Array>} Array of category objects with shape:
 *  { id, name, iconName, icon (React component) }
 */
export const fetchCategories = async () => {
  const data = await request(API_CATEGORIES);
  return data.map(cat => ({
    ...cat,
    icon: LucideIcons[cat.iconName] || LucideIcons.Package,
  }));
};