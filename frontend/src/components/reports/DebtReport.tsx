"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FileDown } from "lucide-react";
import { getDebtReport, DebtReportData } from "@/lib/api/report";

interface DebtReportProps {
  onExport?: (format: "xlsx" | "pdf") => void;
}

export function DebtReport({ onExport }: DebtReportProps) {
  const [filters, setFilters] = useState({
    statusSigned: true,
    customer: "",
  });

  const [report, setReport] = useState<DebtReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await getDebtReport({
        signedOnly: filters.statusSigned,
        customerName: filters.customer || undefined,
        page: 1,
        limit: 50,
      });

      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error("Load debt report failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadReport();
  };

  const records = report?.items || [];
  const totalDebt = report?.summary.totalDebt || 0;

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
          <Button className="gap-2" onClick={handleSearch} disabled={loading}>
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
              {records.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.contractNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${record.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                    ${record.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    <span
                      className={
                        record.remainingAmount > 0
                          ? "text-red-600"
                          : "text-gray-900"
                      }
                    >
                      ${record.remainingAmount.toLocaleString()}
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
