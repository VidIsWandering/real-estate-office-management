import { Building2, Home, Key, CheckCircle } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/chart/RevenueChart";
import { SalesChart } from "@/components/dashboard/chart/SalesChart";
import { RecentUpdates } from "@/components/dashboard//RecentUpdates";
import { RecentActivities } from "@/components/dashboard/RecentActivites";

export default function Index() {
  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
         
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Properties"
          value="348"
          icon={<Building2 className="w-6 h-6" />}
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title="Properties for Sale"
          value="156"
          icon={<Home className="w-6 h-6" />}
          trend={{ value: 8, positive: true }}
        />
        <KPICard
          title="Properties for Rent"
          value="192"
          icon={<Key className="w-6 h-6" />}
          trend={{ value: 5, positive: false }}
        />
        <KPICard
          title="Completed Transactions"
          value="45"
          icon={<CheckCircle className="w-6 h-6" />}
          trend={{ value: 25, positive: true }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart />
          <SalesChart />
        </div>

        {/* Right Column - Lists */}
        <div className="space-y-8">
          <RecentUpdates />
          <RecentActivities />
        </div>
      </div>
    </>
  );
}
