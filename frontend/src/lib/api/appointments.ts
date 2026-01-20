import { get, getAuthToken } from "./client";

export type AppointmentStatus =
  | "created"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: number;
  real_estate_id: number;
  client_id: number;
  staff_id: number;
  start_time: string;
  end_time: string;
  location: string | null;
  status: AppointmentStatus;
  note: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPagination(value: unknown): value is Pagination {
  if (!isRecord(value)) return false;
  return (
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

export async function getAppointmentsList(params?: {
  page?: number;
  limit?: number;
  real_estate_id?: number;
  client_id?: number;
  staff_id?: number;
  status?: AppointmentStatus;
  from_time?: string;
  to_time?: string;
}): Promise<{ success: boolean; data: Appointment[]; pagination: Pagination }> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.real_estate_id)
    query.set("real_estate_id", String(params.real_estate_id));
  if (params?.client_id) query.set("client_id", String(params.client_id));
  if (params?.staff_id) query.set("staff_id", String(params.staff_id));
  if (params?.status) query.set("status", params.status);
  if (params?.from_time) query.set("from_time", params.from_time);
  if (params?.to_time) query.set("to_time", params.to_time);

  const qs = query.toString();
  const raw = await get<unknown>(`/appointments${qs ? `?${qs}` : ""}`, token);

  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;

  // Backend usually returns: { success, data: Appointment[], pagination }
  const rawData = rawObj.data;
  const rawPagination = isPagination(rawObj.pagination)
    ? rawObj.pagination
    : undefined;

  if (Array.isArray(rawData)) {
    const items = rawData as Appointment[];
    return {
      success,
      data: items,
      pagination:
        rawPagination ??
        ({
          page: params?.page ?? 1,
          limit: params?.limit ?? items.length,
          total: items.length,
          totalPages: 1,
        } satisfies Pagination),
    };
  }

  // Fallback: sometimes list endpoints embed pagination under data
  if (isRecord(rawData) && Array.isArray(rawData.items)) {
    const items = rawData.items as Appointment[];
    const embeddedPagination = isPagination(rawData.pagination)
      ? (rawData.pagination as Pagination)
      : undefined;

    return {
      success,
      data: items,
      pagination:
        embeddedPagination ??
        rawPagination ??
        ({
          page: params?.page ?? 1,
          limit: params?.limit ?? items.length,
          total: items.length,
          totalPages: 1,
        } satisfies Pagination),
    };
  }

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
