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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FileDown } from "lucide-react";

interface DebtRecord {
  id: string;
  contractNo: string;
  customer: string;
  totalValue: number;
  paid: number;
  remaining: number;
  dueDate: string;
  status: "Signed" | "Not signed";
}

const mockDebtRecords: DebtRecord[] = [
  {
    id: "1",
    contractNo: "HD001",
    customer: "John Wilson",
    totalValue: 950000,
    paid: 475000,
    remaining: 475000,
    dueDate: "2024-02-15",
    status: "Signed",
  },
  {
    id: "2",
    contractNo: "HD002",
    customer: "Sarah Martinez",
    totalValue: 425000,
    paid: 212500,
    remaining: 212500,
    dueDate: "2024-02-18",
    status: "Signed",
  },
  {
    id: "3",
    contractNo: "HD003",
    customer: "Michael Chen",
    totalValue: 1200000,
    paid: 1200000,
    remaining: 0,
    dueDate: "2024-01-20",
    status: "Signed",
  },
  {
    id: "4",
    contractNo: "HD004",
    customer: "Lisa Anderson",
    totalValue: 650000,
    paid: 325000,
    remaining: 325000,
    dueDate: "2024-02-22",
    status: "Signed",
  },
  {
    id: "5",
    contractNo: "HD005",
    customer: "David Thompson",
    totalValue: 580000,
    paid: 290000,
    remaining: 290000,
    dueDate: "2024-02-25",
    status: "Signed",
  },
  {
    id: "6",
    contractNo: "HD006",
    customer: "Emma Johnson",
    totalValue: 780000,
    paid: 0,
    remaining: 780000,
    dueDate: "2024-03-01",
    status: "Not signed",
  },
];

interface DebtReportProps {
  onExport?: (format: "xlsx" | "pdf") => void;
}

export function DebtReport({ onExport }: DebtReportProps) {
  const [filters, setFilters] = useState({
    statusSigned: true,
    customer: "",
  });

  const [records] = useState<DebtRecord[]>(mockDebtRecords);

  const filteredRecords = records.filter((record) => {
    if (filters.statusSigned && record.status !== "Signed") return false;
    if (
      filters.customer &&
      !record.customer.toLowerCase().includes(filters.customer.toLowerCase())
    )
      return false;
    return true;
  });

  const totalDebt = filteredRecords.reduce(
    (sum, record) => sum + record.remaining,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Debt report</h2>
          {/* <p className="text-sm text-gray-600 mt-1">BM8.3</p> */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="statusSigned"
              checked={filters.statusSigned}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, statusSigned: checked as boolean })
              }
            />
            <label
              htmlFor="statusSigned"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Signed only
            </label>
          </div>
          <div>
            <Label htmlFor="customer" className="mb-2 block">
              Customer
            </Label>
            <Input
              id="customer"
              type="text"
              placeholder="Enter customer name..."
              value={filters.customer}
              onChange={(e) =>
                setFilters({ ...filters, customer: e.target.value })
              }
            />
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
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total contract value
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Due date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.contractNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${record.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                    ${record.paid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    <span
                      className={
                        record.remaining > 0 ? "text-red-600" : "text-gray-900"
                      }
                    >
                      ${record.remaining.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total receivables:{" "}
            <span className="font-bold text-red-600 text-lg ml-2">
              ${totalDebt.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
