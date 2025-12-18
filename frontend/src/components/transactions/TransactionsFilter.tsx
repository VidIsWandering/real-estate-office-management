"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function TransactionsFilter({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4" />
          <Input
            placeholder="Search by property, client, transaction ID..."
            className="pl-9"
          />
        </div>

        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="rentals">Rentals</SelectItem>
            <SelectItem value="leases">Leases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onCreate} className="bg-primary text-white px-4">
        + New Transaction
      </Button>
    </div>
  );
}
