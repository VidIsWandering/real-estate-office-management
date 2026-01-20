/**
 * Auth API - Account & Security Tabs
 * Manages authentication and user profile
 */

import { get, post, put, del, getAuthToken } from "./client";

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
  action_type: string;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
}

export interface ActiveSession {
  id: number;
  ip_address: string;
  user_agent: string;
  device_info: Record<string, unknown>;
  last_activity: string;
  expires_at: string;
  is_current: boolean;
  created_at: string;
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
  confirm_password: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: { message?: string };
}> {
  const token = getAuthToken();
  return put("/auth/change-password", data, token);
}

// ==================== SECURITY APIs ====================

/**
 * GET /auth/login-history - Get login history
 */
export async function getLoginHistory(params?: { limit?: number }): Promise<{
  success: boolean;
  message: string;
  data: LoginHistory[];
}> {
  const token = getAuthToken();
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return get(`/auth/login-history${qs ? `?${qs}` : ""}`, token);
}

/**
 * GET /auth/sessions - Get active sessions
 */
export async function getActiveSessions(): Promise<{
  success: boolean;
  message: string;
  data: ActiveSession[];
}> {
  const token = getAuthToken();
  return get("/auth/sessions", token);
}

/**
 * DELETE /auth/sessions/{id} - Revoke session
 */
export async function revokeSession(sessionId: number): Promise<{
  success: boolean;
  message: string;
  data: { revoked: boolean };
}> {
  const token = getAuthToken();
  return del(`/auth/sessions/${sessionId}`, token);
}

/**
 * POST /auth/sessions/revoke-all - Revoke all sessions except current
 */
export async function revokeAllSessions(currentSessionId?: number): Promise<{
  success: boolean;
  message: string;
  data: { revoked_count: number };
}> {
  const token = getAuthToken();
  const payload = currentSessionId
    ? { current_session_id: currentSessionId }
    : {};
  return post("/auth/sessions/revoke-all", payload, token);
}

// ==================== 2FA APIs (Placeholder) ====================

/**
 * POST /auth/2fa/enable - Enable 2FA (Not implemented in backend yet)
 */
export async function enable2FA(): Promise<{
  success: boolean;
  message: string;
  data?: { qr_code: string; secret: string };
}> {
  const token = getAuthToken();
  return post("/auth/2fa/enable", {}, token);
}

/**
 * POST /auth/2fa/disable - Disable 2FA (Not implemented in backend yet)
 */
export async function disable2FA(data: {
  password: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return post("/auth/2fa/disable", data, token);
}

/**
 * POST /auth/2fa/verify - Verify 2FA (Not implemented in backend yet)
 */
export async function verify2FA(data: {
  token: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  return post("/auth/2fa/verify", data, token);
}
