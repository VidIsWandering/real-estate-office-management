/**
 * Auth API - Account & Security Tabs
 * Manages authentication and user profile
 */

import { get, post, put, getAuthToken } from "./client";

// ==================== TYPES ====================

export interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  assigned_area: string | null;
  position: string;
  status: string;
  preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LoginHistory {
  id: number;
  staff_id: number;
  login_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface ActiveSession {
  id: string;
  staff_id: number;
  login_at: string;
  last_activity: string;
  ip_address: string | null;
  user_agent: string | null;
}

// ==================== PROFILE APIs ====================

/**
 * Get current user profile
 */
export async function getProfile(): Promise<{
  success: boolean;
  data: UserProfile;
}> {
  const token = getAuthToken();
  return get("/auth/profile", token);
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  preferences?: Record<string, unknown>;
}): Promise<{ success: boolean; data: UserProfile }> {
  const token = getAuthToken();
  return put("/auth/profile", data, token);
}

/**
 * Change password
 */
export async function changePassword(data: {
  current_password: string;
  new_password: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return put("/auth/change-password", data, token);
}

// ==================== SECURITY APIs ====================

/**
 * Get login history
 */
export async function getLoginHistory(): Promise<{
  success: boolean;
  data: LoginHistory[];
}> {
  const token = getAuthToken();
  return get("/security/login-history", token);
}

/**
 * Get active sessions
 */
export async function getActiveSessions(): Promise<{
  success: boolean;
  data: ActiveSession[];
}> {
  const token = getAuthToken();
  return get("/security/sessions", token);
}

/**
 * Revoke session
 */
export async function revokeSession(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return post(`/security/sessions/${sessionId}/revoke`, {}, token);
}

/**
 * Revoke all sessions except current
 */
export async function revokeAllSessions(): Promise<{
  success: boolean;
  message: string;
}> {
  const token = getAuthToken();
  return post("/security/sessions/revoke-all", {}, token);
}

// ==================== 2FA APIs (Placeholder) ====================

/**
 * Enable 2FA (Not implemented in backend yet)
 */
export async function enable2FA(): Promise<{
  success: boolean;
  data: { qr_code: string; secret: string };
}> {
  const token = getAuthToken();
  return post("/security/2fa/enable", {}, token);
}

/**
 * Disable 2FA (Not implemented in backend yet)
 */
export async function disable2FA(data: {
  password: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return post("/security/2fa/disable", data, token);
}

/**
 * Verify 2FA (Not implemented in backend yet)
 */
export async function verify2FA(data: {
  code: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return post("/security/2fa/verify", data, token);
}
