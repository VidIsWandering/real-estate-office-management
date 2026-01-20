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

export interface PaymentsFilterValues {
  search: string;
  voucherType: string;
  paymentMethod: string;
  status: string;
}

interface PaymentsFilterProps {
  onCreate?: () => void;
  filters?: PaymentsFilterValues;
  onFilterChange?: (filters: PaymentsFilterValues) => void;
}

export function PaymentsFilter({
  onCreate,
  filters,
  onFilterChange,
}: PaymentsFilterProps) {
  const currentFilters = filters || {
    search: "",
    voucherType: "all",
    paymentMethod: "all",
    status: "all",
  };

  const handleFilterChange = (
    key: keyof PaymentsFilterValues,
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
            placeholder="Search by voucher ID, contract ID, payer/payee..."
            className="pl-9"
            value={currentFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <Select
          value={currentFilters.voucherType}
          onValueChange={(v) => handleFilterChange("voucherType", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Voucher type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="receipt">Receipt</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.paymentMethod}
          onValueChange={(v) => handleFilterChange("paymentMethod", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank transfer</SelectItem>
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
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
      >
        <Plus className="w-5 h-5" />
        New Voucher
      </button>
    </div>
  );
}
