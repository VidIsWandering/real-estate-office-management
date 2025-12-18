"use client";

import { useState } from "react";
import { RevenueReport } from "@/components/reports/RevenueReport";
import { AgentPerformanceReport } from "@/components/reports/AgentPerformanceReport";
import { DebtReport } from "@/components/reports/DebtReport";
import { FileText, TrendingUp, DollarSign } from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState<
    "revenue" | "performance" | "debt"
  >("revenue");

  const handleExport = (format: "xlsx" | "pdf") => {
    console.log(`Exporting ${activeTab} report as ${format}`);
    // TODO: Implement export functionality
    alert(`Export report as ${format.toUpperCase()}`);
  };

  const tabs = [
    {
      id: "revenue" as const,
      label: "Revenue Reports",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "performance" as const,
      label: "Agent Performance",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "debt" as const,
      label: "Debt",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          Business reporting and performance analytics.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "revenue" && <RevenueReport onExport={handleExport} />}
        {activeTab === "performance" && (
          <AgentPerformanceReport onExport={handleExport} />
        )}
        {activeTab === "debt" && <DebtReport onExport={handleExport} />}
      </div>
    </>
  );
}
