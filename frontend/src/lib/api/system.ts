/**
 * System Config API - Office & Notifications Tabs
 * Manages system-wide configurations
 */

import { get, put, getAuthToken } from "./client";

// ==================== TYPES ====================

export interface SystemConfig {
  key: string;
  value: any;
  updated_at: string;
}

// ==================== SYSTEM CONFIG APIs ====================

/**
 * Get all system configurations
 */
export async function getAllSystemConfigs(): Promise<{
  success: boolean;
  data: SystemConfig[];
}> {
  const token = getAuthToken();
  return get("/system/configs", token);
}

/**
 * Update system configuration
 */
export async function updateSystemConfig(
  key: string,
  value: any
): Promise<{ success: boolean; data: SystemConfig }> {
  const token = getAuthToken();
  return put(`/system/configs/${key}`, { value }, token);
}
