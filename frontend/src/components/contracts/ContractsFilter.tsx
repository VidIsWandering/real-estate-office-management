"use client";

import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface ContractsFilterValues {
  search: string;
  type: string;
  status: string;
}

export function ContractsFilter({
  onCreate,
  filters,
  onFilterChange,
}: {
  onCreate: () => void;
  filters?: ContractsFilterValues;
  onFilterChange?: (filters: ContractsFilterValues) => void;
}) {
  const currentFilters = filters || {
    search: "",
    type: "all",
    status: "all",
  };

  const handleFilterChange = (
    key: keyof ContractsFilterValues,
    value: string,
  ) => {
    if (onFilterChange) {
      onFilterChange({ ...currentFilters, [key]: value });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4" />
          <Input
            placeholder="Search by contract ID, transaction ID, Party A, or Party B..."
            className="pl-9"
            value={currentFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <Select
          value={currentFilters.type}
          onValueChange={(v) => handleFilterChange("type", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="deposit">Deposit agreement</SelectItem>
            <SelectItem value="purchase">Sale & purchase agreement</SelectItem>
            <SelectItem value="lease">Lease agreement</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.status}
          onValueChange={(v) => handleFilterChange("status", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_signature">
              Awaiting signature
            </SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="notarized">Notarized</SelectItem>
            <SelectItem value="finalized">Liquidated</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
      >
        <Plus className="w-5 h-5" />
        New Contract
      </button>
    </div>
  );
}
