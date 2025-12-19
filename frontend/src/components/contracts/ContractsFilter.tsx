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

export function ContractsFilter({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4" />
          <Input
            placeholder="Search by contract ID, transaction ID, Party A, or Party B..."
            className="pl-9"
          />
        </div>

        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="deposit">Deposit agreement</SelectItem>
            <SelectItem value="sale">Sale & purchase agreement</SelectItem>
            <SelectItem value="lease">Lease agreement</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Awaiting signature</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="notarized">Notarized</SelectItem>
            <SelectItem value="liquidated">Liquidated</SelectItem>
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
