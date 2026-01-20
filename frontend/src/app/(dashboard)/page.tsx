"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle, Users, Wallet } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/chart/RevenueChart";
import { SalesChart } from "@/components/dashboard/chart/SalesChart";
import { RecentUpdates } from "@/components/dashboard/RecentUpdates";
import { RecentActivities } from "@/components/dashboard/RecentActivites";
import {
  getAgentPerformanceChart,
  getDashboardRecentTransactions,
  getDashboardStats,
  getDashboardTopProperties,
  getPropertySalesChart,
  type AgentPerformanceChartItem,
  type DashboardRecentTransaction,
  type DashboardStats,
  type DashboardTopProperty,
  type PropertySalesChartItem,
} from "@/lib/api/reports";

function formatVnd(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${Math.round(value).toLocaleString("vi-VN")} VND`;
}

export default function Index() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agentChart, setAgentChart] = useState<AgentPerformanceChartItem[]>([]);
  const [propertyChart, setPropertyChart] = useState<PropertySalesChartItem[]>(
    [],
  );
  const [topProperties, setTopProperties] = useState<DashboardTopProperty[]>(
    [],
  );
  const [recentTransactions, setRecentTransactions] = useState<
    DashboardRecentTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, agentRes, propertyRes, topRes, recentRes] =
          await Promise.all([
            getDashboardStats(),
            getAgentPerformanceChart(),
            getPropertySalesChart(),
            getDashboardTopProperties({ limit: 5 }),
            getDashboardRecentTransactions({ limit: 5 }),
          ]);

        if (cancelled) return;

        setStats(statsRes.data);
        setAgentChart(agentRes.data ?? []);
        setPropertyChart(propertyRes.data ?? []);
        setTopProperties(topRes.data ?? []);
        setRecentTransactions(recentRes.data ?? []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const overview = stats?.overview;

  const revenueTrend = useMemo(() => {
    const change = overview?.revenueChange;
    if (typeof change !== "number" || !Number.isFinite(change))
      return undefined;

    return {
      value: Math.abs(change),
      positive: change >= 0,
    };
  }, [overview?.revenueChange]);

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1"></p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Properties"
          value={loading ? "—" : (overview?.totalProperties ?? 0)}
          icon={<Building2 className="w-6 h-6" />}
        />
        <KPICard
          title="Active Listings"
          value={loading ? "—" : (overview?.activeListings ?? 0)}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <KPICard
          title="Total Clients"
          value={loading ? "—" : (overview?.totalClients ?? 0)}
          icon={<Users className="w-6 h-6" />}
        />
        <KPICard
          title="Monthly Revenue"
          value={loading ? "—" : formatVnd(overview?.monthlyRevenue)}
          icon={<Wallet className="w-6 h-6" />}
          trend={revenueTrend}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart data={propertyChart} loading={loading} />
          <SalesChart data={agentChart} loading={loading} />
        </div>

        {/* Right Column - Lists */}
        <div className="space-y-8">
          <RecentUpdates items={topProperties} loading={loading} />
          <RecentActivities items={recentTransactions} loading={loading} />
        </div>
      </div>
    </>
  );
}
