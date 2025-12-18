"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FileDown } from "lucide-react";

interface AgentPerformance {
  id: string;
  agentName: string;
  properties: number;
  completedAppointments: number;
  initiatedDeals: number;
  successfulContracts: number;
  conversionRate: number;
  revenue: number;
}

const mockPerformance: AgentPerformance[] = [
  {
    id: "1",
    agentName: "Alice Chen",
    properties: 12,
    completedAppointments: 45,
    initiatedDeals: 28,
    successfulContracts: 18,
    conversionRate: 64.3,
    revenue: 8500000,
  },
  {
    id: "2",
    agentName: "Bob Smith",
    properties: 10,
    completedAppointments: 38,
    initiatedDeals: 22,
    successfulContracts: 14,
    conversionRate: 63.6,
    revenue: 6200000,
  },
  {
    id: "3",
    agentName: "Carol Davis",
    properties: 15,
    completedAppointments: 52,
    initiatedDeals: 30,
    successfulContracts: 20,
    conversionRate: 66.7,
    revenue: 7800000,
  },
  {
    id: "4",
    agentName: "David Lee",
    properties: 8,
    completedAppointments: 32,
    initiatedDeals: 19,
    successfulContracts: 11,
    conversionRate: 57.9,
    revenue: 5900000,
  },
  {
    id: "5",
    agentName: "Emma Wilson",
    properties: 18,
    completedAppointments: 64,
    initiatedDeals: 35,
    successfulContracts: 24,
    conversionRate: 68.6,
    revenue: 9200000,
  },
];

const agentOptions = [
  "All",
  "Alice Chen",
  "Bob Smith",
  "Carol Davis",
  "David Lee",
  "Emma Wilson",
];

interface AgentPerformanceReportProps {
  onExport?: (format: "xlsx" | "pdf") => void;
}

export function AgentPerformanceReport({
  onExport,
}: AgentPerformanceReportProps) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    agent: "All",
  });

  const [performances] = useState<AgentPerformance[]>(mockPerformance);

  const totalRevenue = performances.reduce(
    (sum, perf) => sum + perf.revenue,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Agent performance report
          </h2>
          {/* <p className="text-sm text-gray-600 mt-1">BM8.2</p> */}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onExport?.("xlsx")}
            className="gap-2"
          >
            <FileDown className="w-4 h-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport?.("pdf")}
            className="gap-2"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fromDate" className="mb-2 block">
              From
            </Label>
            <Input
              id="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="toDate" className="mb-2 block">
              To
            </Label>
            <Input
              id="toDate"
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="agent" className="mb-2 block">
              Agent
            </Label>
            <Select
              value={filters.agent}
              onValueChange={(value) => setFilters({ ...filters, agent: value })}
            >
              <SelectTrigger id="agent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agentOptions.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Completed appointments
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Initiated deals
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Successful contracts
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Conversion rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performances.map((perf, index) => (
                <tr key={perf.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {perf.agentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {perf.properties}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {perf.completedAppointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {perf.initiatedDeals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                    {perf.successfulContracts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="font-semibold text-primary">
                      {perf.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total revenue:{" "}
            <span className="font-bold text-gray-900 text-lg ml-2">
              ${totalRevenue.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
