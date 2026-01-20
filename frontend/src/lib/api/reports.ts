import { get, getAuthToken } from "./client";

export type DashboardRealEstateStatus =
  | "created"
  | "pending_legal_check"
  | "listed"
  | "negotiating"
  | "transacted"
  | "suspended";

export interface DashboardOverview {
  totalProperties: number;
  activeListings: number;
  totalClients: number;
  totalContracts: number;
  monthlyRevenue: number;
  revenueChange: number;
  lastMonthRevenue?: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  propertiesByStatus: Record<string, number>;
  propertiesByType: Array<{ type: string; count: number; percentage: number }>;
}

export interface DashboardRecentTransaction {
  id: number;
  property: { id: number; title: string };
  agent: { id: number; fullName: string };
  amount: number;
  date: string | null;
  type: string | null;
}

export interface DashboardTopProperty {
  id: number;
  rank: number;
  title: string;
  location: string | null;
  price: number;
  type: string | null;
  status: DashboardRealEstateStatus;
}

export interface AgentPerformanceChartItem {
  agentId: number;
  agentName: string;
  sales: number;
  revenue: number;
}

export interface PropertySalesChartItem {
  type: string;
  sold: number;
  available: number;
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  data: DashboardStats;
}> {
  const token = getAuthToken();
  return get(`/reports/dashboard/stats`, token);
}

export async function getDashboardRecentTransactions(params?: {
  limit?: number;
}): Promise<{ success: boolean; data: DashboardRecentTransaction[] }> {
  const token = getAuthToken();
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));

  return get(
    `/reports/dashboard/recent-transactions${qs.toString() ? `?${qs}` : ""}`,
    token,
  );
}

export async function getDashboardTopProperties(params?: {
  limit?: number;
  status?: DashboardRealEstateStatus;
}): Promise<{ success: boolean; data: DashboardTopProperty[] }> {
  const token = getAuthToken();
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);

  return get(
    `/reports/dashboard/top-properties${qs.toString() ? `?${qs}` : ""}`,
    token,
  );
}

export async function getAgentPerformanceChart(): Promise<{
  success: boolean;
  data: AgentPerformanceChartItem[];
}> {
  const token = getAuthToken();
  return get(`/reports/dashboard/agent-performance-chart`, token);
}

export async function getPropertySalesChart(): Promise<{
  success: boolean;
  data: PropertySalesChartItem[];
}> {
  const token = getAuthToken();
  return get(`/reports/dashboard/property-sales-chart`, token);
}
