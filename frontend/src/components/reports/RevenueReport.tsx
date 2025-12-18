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

interface Contract {
  id: string;
  contractNo: string;
  property: string;
  agent: string;
  value: number;
  signDate: string;
  status: "Signed" | "Pending" | "Finished";
}

const mockContracts: Contract[] = [
  {
    id: "1",
    contractNo: "HD001",
    property: "123 Oak Street, Downtown",
    agent: "Alice Chen",
    value: 950000,
    signDate: "2024-01-15",
    status: "Finished",
  },
  {
    id: "2",
    contractNo: "HD002",
    property: "456 Maple Avenue, Suburban",
    agent: "Bob Smith",
    value: 425000,
    signDate: "2024-01-18",
    status: "Signed",
  },
  {
    id: "3",
    contractNo: "HD003",
    property: "789 Pine Road, Business District",
    agent: "Carol Davis",
    value: 1200000,
    signDate: "2024-01-20",
    status: "Finished",
  },
  {
    id: "4",
    contractNo: "HD004",
    property: "321 Elm Street, Waterfront",
    agent: "David Lee",
    value: 650000,
    signDate: "2024-01-22",
    status: "Pending",
  },
  {
    id: "5",
    contractNo: "HD005",
    property: "654 Cedar Lane, Urban",
    agent: "Emma Wilson",
    value: 580000,
    signDate: "2024-01-25",
    status: "Pending",
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

const areaOptions = [
"All",
  "Downtown",
  "Suburban",
  "Business District",
  "Waterfront",
  "Urban",
];

interface RevenueReportProps {
  onExport?: (format: "xlsx" | "pdf") => void;
}

export function RevenueReport({ onExport }: RevenueReportProps) {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    agent: "All",
    area: "All",
  });

  const [contracts] = useState<Contract[]>(mockContracts);

  const totalRevenue = contracts.reduce((sum, contract) => sum + contract.value, 0);
  const totalContracts = contracts.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-green-50 text-green-700 border-green-200";
      case "Signed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Revenue Report
          </h2>
          {/* <p className="text-sm text-gray-600 mt-1">BM8.1</p> */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div>
            <Label htmlFor="area" className="mb-2 block">
              Area
            </Label>
            <Select
              value={filters.area}
              onValueChange={(value) => setFilters({ ...filters, area: value })}
            >
              <SelectTrigger id="area">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {areaOptions.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
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
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contract value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date of signing
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract, index) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.contractNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contract.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.agent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    ${contract.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.signDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        contract.status,
                      )}`}
                    >
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Total revenue:{" "}
                <span className="font-bold text-gray-900 text-lg ml-2">
                  ${totalRevenue.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Number of contracts:{" "}
                <span className="font-bold text-gray-900 ml-2">
                  {totalContracts}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
