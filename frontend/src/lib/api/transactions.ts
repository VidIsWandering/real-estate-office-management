import { get, getAuthToken, post, put } from "./client";

export type TransactionStatus =
  | "negotiating"
  | "pending_contract"
  | "cancelled";

export interface Transaction {
  id: number;
  real_estate_id: number;
  client_id: number;
  staff_id: number;
  offer_price: number | string;
  terms: Array<string | number>;
  status: TransactionStatus;
  cancellation_reason: string | null;
}

export interface Term {
  id: number;
  name: string;
  content: string | null;
}

export type TransactionWithTerms = Omit<Transaction, "terms"> & {
  terms: Term[];
};

export interface TermInput {
  name: string;
  content?: string | null;
}

export interface CreateTransactionInput {
  real_estate_id: number;
  client_id: number;
  offer_price: number;
  terms: TermInput[];
}

export interface UpdateTermInput {
  id: number;
  name?: string;
  content?: string | null;
}

export interface UpdateTransactionInput {
  offer_price?: number;
  terms?: UpdateTermInput[];
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

export async function getTransactionsList(params?: {
  page?: number;
  limit?: number;
  real_estate_id?: number;
  client_id?: number;
  staff_id?: number;
  status?: TransactionStatus;
  min_price?: number;
  max_price?: number;
}): Promise<{ success: boolean; data: Transaction[]; pagination: Pagination }> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.real_estate_id)
    query.set("real_estate_id", String(params.real_estate_id));
  if (params?.client_id) query.set("client_id", String(params.client_id));
  if (params?.staff_id) query.set("staff_id", String(params.staff_id));
  if (params?.status) query.set("status", params.status);
  if (params?.min_price !== undefined)
    query.set("min_price", String(params.min_price));
  if (params?.max_price !== undefined)
    query.set("max_price", String(params.max_price));

  const qs = query.toString();
  const raw = await get<unknown>(`/transactions${qs ? `?${qs}` : ""}`, token);

  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;

  const rawData = rawObj.data;
  const rawPagination = isPagination(rawObj.pagination)
    ? rawObj.pagination
    : undefined;

  if (Array.isArray(rawData)) {
    const items = rawData as Transaction[];
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
    const items = rawData.items as Transaction[];
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

export async function createTransaction(data: CreateTransactionInput): Promise<{
  success: boolean;
  data: {
    transaction: TransactionWithTerms;
    real_estate: unknown;
    client: unknown;
  };
}> {
  const token = getAuthToken();
  return post(`/transactions`, data, token);
}

export async function getTransactionById(id: number): Promise<{
  success: boolean;
  data: {
    transaction: TransactionWithTerms;
    client: unknown;
    real_estate: unknown;
  };
}> {
  const token = getAuthToken();
  return get(`/transactions/${id}`, token);
}

export async function updateTransaction(
  id: number,
  data: UpdateTransactionInput,
): Promise<{ success: boolean; data: Transaction | TransactionWithTerms }> {
  const token = getAuthToken();
  return put(`/transactions/${id}`, data, token);
}

export async function finalizeTransaction(
  id: number,
): Promise<{ success: boolean; data: Transaction }> {
  const token = getAuthToken();
  return put(`/transactions/${id}/finalize`, undefined, token);
}

export async function cancelTransaction(
  id: number,
  reason?: string,
): Promise<{ success: boolean; data: Transaction }> {
  const token = getAuthToken();
  return put(`/transactions/${id}/cancel`, { reason: reason || null }, token);
}
