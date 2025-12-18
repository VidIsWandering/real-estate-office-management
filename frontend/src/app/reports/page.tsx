"use client";

import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/chart/RevenueChart";
import { PropertySalesChart } from "@/components/reports/PropertySalesChart";
import { AgentPerformanceChart } from "@/components/reports/AgentPerformanceChart";
import { PropertyTypesChart } from "@/components/reports/PropertyTypesChart";
import { RecentTransactions } from "@/components/reports/RecentTransactions";
import { TopProperties } from "@/components/reports/TopProperties";
import { DollarSign, Handshake, Users, TrendingUp } from "lucide-react";

export default function Reports() {
  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive business analytics and performance metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value="$4.2M"
          icon={<DollarSign className="w-6 h-6" />}
          trend={{ value: 18, positive: true }}
        />
        <KPICard
          title="Active Deals"
          value="87"
          icon={<Handshake className="w-6 h-6" />}
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title="New Clients This Month"
          value="24"
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, positive: true }}
        />
        <KPICard
          title="Average Property Price"
          value="$625K"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 5, positive: false }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RevenueChart />
        <PropertySalesChart />
        <AgentPerformanceChart />
        <PropertyTypesChart />
      </div>

      {/* Bottom Section - Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions />
        <TopProperties />
      </div>
    </>
  );
}
