import { get, post, put, patch, getAuthToken } from "./client";

export type StaffStatus = "working" | "off_duty";
export type StaffRole =
  | "admin"
  | "manager"
  | "agent"
  | "legal_officer"
  | "accountant";

export interface StaffBasic {
  id: number;
  full_name: string;
  assigned_area: string | null;
  position: StaffRole;
  status: StaffStatus;
}

export interface StaffFull extends StaffBasic {
  account_id: number;
  username: string;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  preferences?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export type Staff = StaffBasic | StaffFull;

export interface StaffPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getStaffList(params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}): Promise<{ success: boolean; data: Staff[]; pagination: StaffPagination }> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.role) query.set("role", params.role);
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  return get(`/staff${qs ? `?${qs}` : ""}`, token);
}

export async function getStaffById(
  staffId: number | string,
): Promise<{ success: boolean; data: Staff }> {
  const token = getAuthToken();
  return get(`/staff/${staffId}`, token);
}

export async function createStaff(data: {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  assigned_area?: string;
  role: StaffRole;
  status?: StaffStatus;
}): Promise<{ success: boolean; data: StaffFull }> {
  const token = getAuthToken();
  return post(`/staff`, data, token);
}

export async function updateStaff(
  staffId: number | string,
  data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    assigned_area?: string;
    role?: StaffRole;
    status?: StaffStatus;
  },
): Promise<{ success: boolean; data: StaffFull }> {
  const token = getAuthToken();
  return put(`/staff/${staffId}`, data, token);
}

export async function updateStaffStatus(
  staffId: number | string,
  status: StaffStatus,
): Promise<{ success: boolean; data: StaffFull }> {
  const token = getAuthToken();
  return patch(`/staff/${staffId}/status`, { status }, token);
}

export async function updateStaffPermissions(
  staffId: number | string,
  data: { role: StaffRole; permissions?: string[] },
): Promise<{ success: boolean; data: StaffFull }> {
  const token = getAuthToken();
  return put(`/staff/${staffId}/permissions`, data, token);
}
