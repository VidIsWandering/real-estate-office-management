/**
 * Report APIs
 */

import { get, getAuthToken } from "./client";

/* ================= REVENUE REPORT ================= */

export interface RevenueItem {
  id: number;
  contractNo: string;
  property: {
    id: number;
    title: string;
    location: string;
  };
  agent: {
    id: number;
    fullName: string;
  };
  totalValue: number;
  signedDate: string;
  transactionType: string;
  status: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalContracts: number;
  byStatus: Record<string, { count: number; value: number }>;
}

export interface RevenueReportData {
  items: RevenueItem[];
  summary: RevenueSummary;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetRevenueReportParams {
  fromDate?: string;
  toDate?: string;
  staffId?: number;
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetRevenueReportResponse {
  success: boolean;
  data: RevenueReportData;
}

/* ================= AGENT PERFORMANCE REPORT ================= */

export interface AgentPerformanceItem {
  id: number;
  agentName: string;
  email: string;
  properties: number;
  completedAppointments: number;
  initiatedDeals: number;
  successfulContracts: number;
  conversionRate: number;
  revenue: number;
}

export interface AgentPerformanceSummary {
  totalAgents: number;
  totalRevenue: number;
  avgConversionRate: number;
}

export interface AgentPerformanceReportData {
  items: AgentPerformanceItem[];
  summary: AgentPerformanceSummary;
}

export interface GetAgentPerformanceReportParams {
  fromDate?: string;
  toDate?: string;
  staffId?: number;
}

export interface GetAgentPerformanceReportResponse {
  success: boolean;
  data: AgentPerformanceReportData;
}

/* ================= DEBT REPORT ================= */

export interface DebtItem {
  id: number;
  contractNo: string;
  customerName: string;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
}

export interface DebtSummary {
  totalDebt: number;
  totalContracts: number;
}

export interface DebtReportData {
  items: DebtItem[];
  summary: DebtSummary;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetDebtReportParams {
  signedOnly?: boolean;
  customerName?: string;
  contractId?: number;
  page?: number;
  limit?: number;
}

export interface GetDebtReportResponse {
  success: boolean;
  data: DebtReportData;
}

/* ================= HELPERS ================= */

function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/* ================= API FUNCTIONS ================= */

/**
 * GET /reports/revenue
 */
export async function getRevenueReport(
  params: GetRevenueReportParams,
): Promise<GetRevenueReportResponse> {
  const token = getAuthToken();
  const query = buildQuery(params as Record<string, unknown>);
  return get(`/reports/revenue${query}`, token);
}

/**
 * GET /reports/agent-performance
 */
export async function getAgentPerformanceReport(
  params: GetAgentPerformanceReportParams,
): Promise<GetAgentPerformanceReportResponse> {
  const token = getAuthToken();
  const query = buildQuery(params as Record<string, unknown>);
  return get(`/reports/agent-performance${query}`, token);
}

/**
 * GET /reports/debt
 */
export async function getDebtReport(
  params: GetDebtReportParams,
): Promise<GetDebtReportResponse> {
  const token = getAuthToken();
  const query = buildQuery(params as Record<string, unknown>);
  return get(`/reports/debt${query}`, token);
}
