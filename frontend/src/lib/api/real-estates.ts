import { get, getAuthToken, patch, postFormData, put, putFormData } from "./client";

export type RealEstateStatus =
  | "created"
  | "pending_legal_check"
  | "listed"
  | "negotiating"
  | "transacted"
  | "suspended";

export interface RealEstate {
  id: number;
  title: string;
  type: string;
  transaction_type: "sale" | "rent";
  location: string;
  price: number | string;
  area: number | string;
  description?: string | null;
  direction?: string | null;
  media_files?: unknown[];
  owner_id: number;
  legal_docs?: unknown[];
  staff_id: number;
  status: RealEstateStatus;
}

export interface RealEstateDetailPayload {
  realEstate: RealEstate;
  owner?: unknown;
  staff?: unknown;
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

/**
 * Normalizes backend responses into `{ success, data: RealEstate[], pagination }`.
 * Backend usually returns: { success, data: RealEstate[], pagination }.
 */
export async function getRealEstatesList(params?: {
  page?: number;
  limit?: number;
  title?: string;
  type?: string;
  transaction_type?: "sale" | "rent";
  location?: string;
  status?: RealEstateStatus;
}): Promise<{ success: boolean; data: RealEstate[]; pagination: Pagination }> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.title) query.set("title", params.title);
  if (params?.type) query.set("type", params.type);
  if (params?.transaction_type) query.set("transaction_type", params.transaction_type);
  if (params?.location) query.set("location", params.location);
  if (params?.status) query.set("status", params.status);

  const qs = query.toString();
  const raw = await get<unknown>(`/real-estates${qs ? `?${qs}` : ""}` , token);

  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;
  const rawData = rawObj.data;
  const rawPagination = isPagination(rawObj.pagination) ? rawObj.pagination : undefined;

  if (Array.isArray(rawData)) {
    const items = rawData as RealEstate[];
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

  if (isRecord(rawData) && Array.isArray(rawData.items)) {
    const items = rawData.items as RealEstate[];
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

export async function createRealEstate(data: {
  title: string;
  type: string;
  transaction_type: "sale" | "rent";
  location: string;
  price: number;
  area: number;
  direction:
    | "north"
    | "south"
    | "east"
    | "west"
    | "northeast"
    | "northwest"
    | "southeast"
    | "southwest";
  owner_id: number;
  description?: string;
  media_files?: File[];
  legal_docs?: File[];
}): Promise<{ success: boolean; data: unknown }> {
  const token = getAuthToken();

  const form = new FormData();
  form.set("title", data.title);
  form.set("type", data.type);
  form.set("transaction_type", data.transaction_type);
  form.set("location", data.location);
  form.set("price", String(data.price));
  form.set("area", String(data.area));
  form.set("direction", data.direction);
  form.set("owner_id", String(data.owner_id));
  if (data.description) form.set("description", data.description);

  for (const file of data.media_files ?? []) {
    form.append("media_files", file);
  }
  for (const file of data.legal_docs ?? []) {
    form.append("legal_docs", file);
  }

  return postFormData(`/real-estates`, form, token);
}

/**
 * GET /real-estates/:id
 * Backend returns: { success, message, data: { realEstate, owner, staff } }
 */
export async function getRealEstateById(
  realEstateId: number | string,
): Promise<{ success: boolean; data: RealEstateDetailPayload | null }> {
  const token = getAuthToken();
  const raw = await get<unknown>(`/real-estates/${realEstateId}`, token);

  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;
  const rawData = rawObj.data;

  if (isRecord(rawData) && isRecord(rawData.realEstate)) {
    return {
      success,
      data: rawData as unknown as RealEstateDetailPayload,
    };
  }

  return { success, data: null };
}

/**
 * PUT /real-estates/:id
 * Supports multipart/form-data for optional media/legal uploads.
 * Backend returns: { success, message, data: { realEstate, owner, staff } }
 */
export async function updateRealEstateById(
  realEstateId: number | string,
  data: {
    title?: string;
    type?: string;
    transaction_type?: "sale" | "rent";
    location?: string;
    price?: number;
    area?: number;
    direction?:
      | "north"
      | "south"
      | "east"
      | "west"
      | "northeast"
      | "northwest"
      | "southeast"
      | "southwest";
    owner_id?: number;
    description?: string;
    media_files?: File[];
    legal_docs?: File[];
  },
): Promise<{ success: boolean; data: RealEstateDetailPayload | null }> {
  const token = getAuthToken();

  const form = new FormData();
  if (typeof data.title === "string") form.set("title", data.title);
  if (typeof data.type === "string") form.set("type", data.type);
  if (typeof data.transaction_type === "string") {
    form.set("transaction_type", data.transaction_type);
  }
  if (typeof data.location === "string") form.set("location", data.location);
  if (typeof data.price === "number") form.set("price", String(data.price));
  if (typeof data.area === "number") form.set("area", String(data.area));
  if (typeof data.direction === "string") form.set("direction", data.direction);
  if (typeof data.owner_id === "number") form.set("owner_id", String(data.owner_id));
  if (typeof data.description === "string") form.set("description", data.description);

  for (const file of data.media_files ?? []) {
    form.append("media_files", file);
  }
  for (const file of data.legal_docs ?? []) {
    form.append("legal_docs", file);
  }

  const raw = await putFormData<unknown>(`/real-estates/${realEstateId}`, form, token);
  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;
  const rawData = rawObj.data;

  if (isRecord(rawData) && isRecord(rawData.realEstate)) {
    return { success, data: rawData as unknown as RealEstateDetailPayload };
  }

  return { success, data: null };
}

/**
 * PATCH /real-estates/:id/status
 */
export async function updateRealEstateStatus(
  realEstateId: number | string,
  status: RealEstateStatus,
  reason?: string,
): Promise<{ success: boolean; data: unknown }> {
  const token = getAuthToken();
  return patch(`/real-estates/${realEstateId}/status`, { status, reason }, token);
}

/**
 * PUT /real-estates/:id/legal-check
 * If approved -> status becomes 'listed'
 * If rejected -> status stays 'pending_legal_check' and note is recorded
 */
export async function legalCheckRealEstate(
  realEstateId: number | string,
  data: { is_approved: boolean; note?: string },
): Promise<{ success: boolean; data: { id: number; status: RealEstateStatus; note?: string } }>
{
  const token = getAuthToken();
  return put(`/real-estates/${realEstateId}/legal-check`, data, token);
}
