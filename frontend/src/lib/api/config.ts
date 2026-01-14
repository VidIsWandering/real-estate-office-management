/**
 * Config API - Settings Page Config Tab
 * Manages catalogs and permissions
 */

import { get, post, put, del, getAuthToken } from "./client";

// ==================== TYPES ====================

export interface Catalog {
  id: number;
  type: "property_type" | "area" | "lead_source" | "contract_type";
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  position: string;
  resource: string;
  permission: string;
  is_granted: boolean;
}

export interface PermissionMatrix {
  [position: string]: {
    [resource: string]: {
      [permission: string]: boolean;
    };
  };
}

// ==================== CATALOG APIs ====================

/**
 * Get catalogs by type
 */
export async function getCatalogsByType(
  type: Catalog["type"]
): Promise<{ success: boolean; data: Catalog[] }> {
  const token = getAuthToken();
  return get(`/config/catalogs?type=${type}`, token);
}

/**
 * Create new catalog
 */
export async function createCatalog(data: {
  type: Catalog["type"];
  value: string;
}): Promise<{ success: boolean; data: Catalog }> {
  const token = getAuthToken();
  return post("/config/catalogs", data, token);
}

/**
 * Update catalog
 */
export async function updateCatalog(
  id: number,
  data: { value: string }
): Promise<{ success: boolean; data: Catalog }> {
  const token = getAuthToken();
  return put(`/config/catalogs/${id}`, data, token);
}

/**
 * Delete catalog (soft delete)
 */
export async function deleteCatalog(
  id: number
): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return del(`/config/catalogs/${id}`, token);
}

/**
 * Reorder catalogs
 */
export async function reorderCatalogs(data: {
  type: Catalog["type"];
  catalog_ids: number[];
}): Promise<{ success: boolean; data: Catalog[] }> {
  const token = getAuthToken();
  return put("/config/catalogs/reorder", data, token);
}

// ==================== PERMISSION APIs ====================

/**
 * Get all permissions as matrix
 */
export async function getAllPermissions(): Promise<{
  success: boolean;
  data: PermissionMatrix;
}> {
  const token = getAuthToken();
  return get("/config/permissions", token);
}

/**
 * Get permissions for specific position
 */
export async function getPermissionsByPosition(
  position: string
): Promise<{ success: boolean; data: PermissionMatrix }> {
  const token = getAuthToken();
  return get(`/config/permissions/${position}`, token);
}

/**
 * Update permissions
 */
export async function updatePermissions(data: {
  permissions: PermissionMatrix;
}): Promise<{ success: boolean; data: Permission[] }> {
  const token = getAuthToken();
  return put("/config/permissions", data, token);
}
