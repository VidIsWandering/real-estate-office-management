/**
 * System Config API - Office & Notifications Tabs
 * Manages system-wide configurations, logs, and terms
 */

import { get, put, post, del, getAuthToken } from "./client";

// ==================== TYPES ====================

export interface SystemConfig {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface SystemConfigResponse {
  success: boolean;
  data: {
    company_name: string;
    company_address?: string;
    company_phone?: string;
    company_email?: string;
    working_hours?: {
      start: string;
      end: string;
    };
    appointment_duration_default?: number;
    notification_settings?: {
      email_enabled: boolean;
      sms_enabled: boolean;
    };
  };
}

export interface UpdateSystemConfigPayload {
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  working_hours?: {
    start: string;
    end: string;
  };
  appointment_duration_default?: number;
  notification_settings?: {
    email_enabled: boolean;
    sms_enabled: boolean;
  };
}

export interface SystemLog {
  id: number;
  actor_id: number;
  actor_name: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  timestamp: string;
  ip_address: string;
}

export interface Term {
  id: number;
  name: string;
  content: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== SYSTEM CONFIG APIs (Old) ====================

/**
 * Get all system configurations (Old endpoint)
 */
export async function getAllSystemConfigs(): Promise<{
  success: boolean;
  data: SystemConfig[];
}> {
  const token = getAuthToken();
  return get("/system/configs", token);
}

/**
 * Update system configuration (Old endpoint)
 */
export async function updateSystemConfig(
  key: string,
  value: unknown,
): Promise<{ success: boolean; data: SystemConfig }> {
  const token = getAuthToken();
  return put(`/system/configs/${key}`, { value }, token);
}

// ==================== SYSTEM CONFIG APIs (New) ====================

/**
 * GET /system/config - Get system configuration
 */
export async function getSystemConfig(): Promise<SystemConfigResponse> {
  const token = getAuthToken();
  return get("/system/config", token);
}

/**
 * PUT /system/config - Update system configuration
 */
export async function updateSystemConfigNew(
  payload: UpdateSystemConfigPayload,
): Promise<{ success: boolean }> {
  const token = getAuthToken();
  return put("/system/config", payload, token);
}

// ==================== LOGS APIs ====================

/**
 * GET /logs - Get system logs
 */
export async function getSystemLogs(params?: {
  page?: number;
  limit?: number;
  actor_id?: number;
  action_type?: string;
  target_type?: string;
  from_date?: string;
  to_date?: string;
}): Promise<{
  success: boolean;
  data: SystemLog[];
  pagination: Pagination;
}> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.actor_id) query.set("actor_id", String(params.actor_id));
  if (params?.action_type) query.set("action_type", params.action_type);
  if (params?.target_type) query.set("target_type", params.target_type);
  if (params?.from_date) query.set("from_date", params.from_date);
  if (params?.to_date) query.set("to_date", params.to_date);

  const qs = query.toString();
  return get(`/logs${qs ? `?${qs}` : ""}`, token);
}

// ==================== TERMS APIs ====================

/**
 * GET /terms - Get all terms
 */
export async function getTerms(): Promise<{
  success: boolean;
  data: Term[];
}> {
  const token = getAuthToken();
  return get("/terms", token);
}

/**
 * POST /terms - Create term
 */
export async function createTerm(payload: {
  name: string;
  content: string;
}): Promise<{ success: boolean; data: Term }> {
  const token = getAuthToken();
  return post("/terms", payload, token);
}

/**
 * PUT /terms/{id} - Update term
 */
export async function updateTerm(
  id: number,
  payload: { name: string; content: string },
): Promise<{ success: boolean; data: Term }> {
  const token = getAuthToken();
  return put(`/terms/${id}`, payload, token);
}

/**
 * DELETE /terms/{id} - Delete term
 */
export async function deleteTerm(id: number): Promise<{ success: boolean }> {
  const token = getAuthToken();
  return del(`/terms/${id}`, token);
}
