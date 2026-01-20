import { get, post, put, patch } from "@/lib/api/client";

/* ================= ENUMS ================= */

export type ContractType = "purchase" | "deposit" | "lease";

export type ContractStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "notarized"
  | "finalized"
  | "cancelled";

/* ================= ENTITY ================= */

export interface Contract {
  id: number;
  transaction_id: number;
  type: ContractType;
  party_a: number;
  party_b: number;
  total_value: number;
  deposit_amount: number;
  paid_amount: number;
  remaining_amount: number;
  signed_date: string | null;
  effective_date: string;
  expiration_date: string;
  status: ContractStatus;
  staff_id: number;
}

/* ================= LIST RESPONSE ================= */

export interface ContractListResponse {
  success: boolean;
  data: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ================= DETAIL RESPONSE ================= */

export interface ContractDetailResponse {
  success: boolean;
  data: Contract & {
    transaction: Record<string, unknown>;
    party_a_info: Record<string, unknown>;
    party_b_info: Record<string, unknown>;
    legal_officer: Record<string, unknown>;
    attachments: {
      id: number;
      url: string;
      name: string;
    }[];
  };
}

/* ================= PAYLOADS ================= */

export interface CreateContractPayload {
  transaction_id: number;
  type: ContractType;
  party_a: number;
  party_b: number;
  total_value: number;
  deposit_amount: number;
  payment_terms: number[]; // ✅ đúng spec
  effective_date: string;
  expiration_date: string;
}

export interface UpdateContractPayload {
  type?: ContractType;
  total_value?: number;
  deposit_amount?: number;
  payment_terms?: number[];
  effective_date?: string;
  expiration_date?: string;
}

export interface UpdateContractStatusPayload {
  status: ContractStatus;
  signed_date?: string;
  cancellation_reason?: string;
}

/* ================= API ================= */

/** CREATE CONTRACT */
export function createContract(payload: CreateContractPayload) {
  return post<{ success: boolean; data: Contract }>("/contracts", payload);
}

/** GET CONTRACT LIST */
export function getContracts(params?: {
  page?: number;
  limit?: number;
  status?: ContractStatus;
  type?: ContractType;
  staff_id?: number;
  from_date?: string;
  to_date?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.type) query.set("type", params.type);
  if (params?.staff_id) query.set("staff_id", String(params.staff_id));
  if (params?.from_date) query.set("from_date", params.from_date);
  if (params?.to_date) query.set("to_date", params.to_date);

  const qs = query.toString();
  return get<ContractListResponse>(`/contracts${qs ? `?${qs}` : ""}`);
}

/** GET CONTRACT BY ID */
export function getContractById(id: number) {
  return get<ContractDetailResponse>(`/contracts/${id}`);
}

/** UPDATE CONTRACT (ONLY DRAFT) */
export function updateContract(id: number, payload: UpdateContractPayload) {
  return put<{ success: boolean; data: Contract }>(`/contracts/${id}`, payload);
}

/** UPDATE CONTRACT STATUS */
export function updateContractStatus(
  id: number,
  payload: UpdateContractStatusPayload,
) {
  return patch<{ success: boolean; data: Contract }>(
    `/contracts/${id}/status`,
    payload,
  );
}

/** UPLOAD CONTRACT FILES */
export function uploadContractFiles(id: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return post<{
    success: boolean;
    data: { id: number; url: string; name: string }[];
  }>(`/contracts/${id}/files`, formData);
}

/** GET CONTRACT FILES */
export function getContractFiles(id: number) {
  return get<{
    success: boolean;
    data: { id: number; url: string; name: string }[];
  }>(`/contracts/${id}/files`);
}
