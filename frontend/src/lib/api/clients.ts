import { del, get, getAuthToken, post, put } from "./client";

export type ClientType = "buyer" | "seller" | "landlord" | "tenant";

export interface Client {
  id: number;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  type: ClientType;
  referral_src?: string | null;
  requirement?: string | null;
  staff_id: number | null;
  staff_name?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClientsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClientNote {
  id: number;
  content: string;
  created_at: string;
  created_by: number;
  created_by_name?: string | null;
}

export async function getClientsList(params?: {
  page?: number;
  limit?: number;
  type?: ClientType;
  staff_id?: number;
  search?: string;
  is_active?: boolean;
}): Promise<{
  success: boolean;
  data: Client[];
  pagination: ClientsPagination;
}> {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.type) query.set("type", params.type);
  if (params?.staff_id) query.set("staff_id", String(params.staff_id));
  if (params?.search) query.set("search", params.search);
  if (typeof params?.is_active === "boolean")
    query.set("is_active", String(params.is_active));

  const qs = query.toString();
  return get(`/clients${qs ? `?${qs}` : ""}`, token);
}

export async function getClientById(
  clientId: number | string,
): Promise<{ success: boolean; data: Client }> {
  const token = getAuthToken();
  return get(`/clients/${clientId}`, token);
}

export async function createClient(data: {
  full_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  type: ClientType;
  referral_src?: string;
  requirement?: string;
  staff_id?: number;
  is_active?: boolean;
  status?: string;
}): Promise<{ success: boolean; data: Client }> {
  const token = getAuthToken();
  return post(`/clients`, data, token);
}

export async function updateClient(
  clientId: number | string,
  data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    type?: ClientType;
    referral_src?: string;
    requirement?: string;
    staff_id?: number;
    is_active?: boolean;
    status?: string;
  },
): Promise<{ success: boolean; data: Client }> {
  const token = getAuthToken();
  return put(`/clients/${clientId}`, data, token);
}

export async function deleteClient(
  clientId: number | string,
): Promise<{ success: boolean; data: unknown }> {
  const token = getAuthToken();
  return del(`/clients/${clientId}`, token);
}

export async function getClientNotes(params: {
  clientId: number | string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  data: ClientNote[];
  pagination: ClientsPagination;
}> {
  const token = getAuthToken();
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return get(`/clients/${params.clientId}/notes${qs ? `?${qs}` : ""}`, token);
}

export async function addClientNote(params: {
  clientId: number | string;
  content: string;
}): Promise<{ success: boolean; data: ClientNote }> {
  const token = getAuthToken();
  return post(
    `/clients/${params.clientId}/notes`,
    { content: params.content },
    token,
  );
}
