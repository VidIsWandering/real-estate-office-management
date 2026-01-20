import { get, post, put, patch, getAuthToken } from "./client";

/* =======================
   Types
======================= */

export type VoucherType = "receipt" | "payment";
export type VoucherStatus = "created" | "confirmed";
export type PaymentMethod = "cash" | "bank_transfer";

export interface PaymentItem {
  id: number;
  contract_id?: number;
  type: VoucherType;
  party: string;
  payment_time: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_description?: string;
  staff_id: number;
  status: VoucherStatus;
}

export interface PaymentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* =======================
   Utils
======================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPagination(value: unknown): value is PaymentPagination {
  if (!isRecord(value)) return false;
  return (
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

/* =======================
   GET /vouchers
======================= */

export async function getPaymentsList(params?: {
  page?: number;
  limit?: number;
  type?: VoucherType;
  status?: VoucherStatus;
  contract_id?: number;
  payment_method?: PaymentMethod;
  from_date?: string;
  to_date?: string;
}): Promise<{
  success: boolean;
  data: PaymentItem[];
  pagination: PaymentPagination;
}> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.type) query.set("type", params.type);
  if (params?.status) query.set("status", params.status);
  if (params?.contract_id) query.set("contract_id", String(params.contract_id));
  if (params?.payment_method)
    query.set("payment_method", params.payment_method);
  if (params?.from_date) query.set("from_date", params.from_date);
  if (params?.to_date) query.set("to_date", params.to_date);

  const qs = query.toString();
  const raw = await get<unknown>(`/vouchers${qs ? `?${qs}` : ""}`, token);

  const rawObj = isRecord(raw) ? raw : {};
  const success = rawObj.success === true;
  const rawData = rawObj.data;
  const rawPagination = isPagination(rawObj.pagination)
    ? rawObj.pagination
    : undefined;

  if (Array.isArray(rawData)) {
    const items = rawData as PaymentItem[];
    return {
      success,
      data: items,
      pagination: rawPagination ?? {
        page: params?.page ?? 1,
        limit: params?.limit ?? items.length,
        total: items.length,
        totalPages: 1,
      },
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

/* =======================
   GET /vouchers/{id}
======================= */

export async function getPaymentById(id: number) {
  const token = getAuthToken();
  return get(`/vouchers/${id}`, token);
}

/* =======================
   POST /vouchers
======================= */

export async function createPayment(form: FormData) {
  const token = getAuthToken();
  return post("/vouchers", form, token);
}

/* =======================
   PUT /vouchers/{id}
======================= */

export async function updatePayment(id: number, form: FormData) {
  const token = getAuthToken();
  return put(`/vouchers/${id}`, form, token);
}

/* =======================
   PATCH /vouchers/{id}/confirm
======================= */

export async function confirmPayment(id: number) {
  const token = getAuthToken();
  return patch(`/vouchers/${id}/confirm`, undefined, token);
}

/* =======================
   GET /debts
======================= */

export async function getDebts(params?: {
  page?: number;
  limit?: number;
  min_amount?: number;
  sort?: "amount_asc" | "amount_desc" | "date_asc" | "date_desc";
}) {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.min_amount) query.set("min_amount", String(params.min_amount));
  if (params?.sort) query.set("sort", params.sort);

  const qs = query.toString();
  return get(`/debts${qs ? `?${qs}` : ""}`, token);
}
