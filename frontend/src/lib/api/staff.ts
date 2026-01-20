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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStaffPagination(value: unknown): value is StaffPagination {
  if (!isRecord(value)) return false;
  return (
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
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

  // Backend currently wraps pagination inside `data`:
  // { success, message, data: { items: Staff[], pagination: {...} } }
  // but some callers expect { data: Staff[], pagination: {...} }.
  const raw = await get<unknown>(`/staff${qs ? `?${qs}` : ""}`, token);

  const rawObj = isRecord(raw) ? raw : {};
  const rawData = rawObj.data;
  const rawPagination = isStaffPagination(rawObj.pagination)
    ? rawObj.pagination
    : undefined;
  const success = rawObj.success === true;

  if (Array.isArray(rawData)) {
    return {
      success,
      data: rawData,
      pagination:
        rawPagination ??
        ({
          page: params?.page ?? 1,
          limit: params?.limit ?? rawData.length,
          total: rawData.length,
          totalPages: 1,
        } satisfies StaffPagination),
    };
  }

  if (isRecord(rawData) && Array.isArray(rawData.items)) {
    const items: Staff[] = rawData.items as Staff[];
    const embeddedPagination = isStaffPagination(rawData.pagination)
      ? rawData.pagination
      : undefined;
    const pagination: StaffPagination =
      embeddedPagination ??
      rawPagination ??
      ({
        page: params?.page ?? 1,
        limit: params?.limit ?? items.length,
        total: items.length,
        totalPages: 1,
      } satisfies StaffPagination);

    return {
      success,
      data: items,
      pagination,
    };
  }

  // Defensive fallback: avoid crashing UI if API shape changes.
  return {
    success,
    data: [],
    pagination: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
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
