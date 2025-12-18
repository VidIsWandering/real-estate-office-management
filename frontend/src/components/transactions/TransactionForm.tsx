"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export function TransactionForm() {
  const [, setPropertyId] = useState("");
  const [, setCustomerId] = useState("");
  const [, setAgentId] = useState("");
  const [transactionStatus, setTransactionStatus] =
    useState<string>("negotiating");

  return (
    <div className="flex flex-col gap-6 p-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
      {/* Container chính: Chia 2 vùng theo hàng dọc để đảm bảo không bị chồng lấn trong Modal */}
      <div className="flex flex-col gap-8">
        {/* SECTION 1: Transaction Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Transaction details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Transaction ID
              </label>
              <Input
                disabled
                placeholder="Auto-generated"
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Agreed price
              </label>
              <Input placeholder="e.g., 8.5B VND" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Property (BM3)
              </label>
              <Select onValueChange={setPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDS001">
                    BDS001 - Townhouse (District 1)
                  </SelectItem>
                  <SelectItem value="BDS002">
                    BDS002 - Apartment (District 7)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Customer (BM2)
              </label>
              <Select onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KH001">KH001 - Nguyễn Văn A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Agent
            </label>
            <Select onValueChange={setAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Agent..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NV001">NV001 - Phạm Văn D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Initial agreement notes
            </label>
            <Textarea
              placeholder="Enter preliminary terms..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </section>

        {/* SECTION 2: Status & Actions */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Transaction status
          </h3>

          <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border">
            {[
              { id: "negotiating", label: "Negotiating" },
              { id: "waiting-contract", label: "Awaiting contract signing" },
              { id: "cancelled", label: "Cancelled" },
            ].map((status) => (
              <div
                key={status.id}
                className="flex items-center gap-2 min-w-[140px]"
              >
                <Checkbox
                  id={status.id}
                  checked={transactionStatus === status.id}
                  onCheckedChange={(checked) =>
                    checked && setTransactionStatus(status.id)
                  }
                />
                <label
                  htmlFor={status.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>

          {transactionStatus === "cancelled" && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
              <label className="text-sm font-medium text-destructive">
                Cancellation reason
              </label>
              <Textarea
                placeholder="Why was this cancelled?"
                className="min-h-[80px]"
              />
            </div>
          )}
        </section>
      </div>

      {/* FOOTER: Nút bấm cố định bên dưới */}
      <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
        <Button variant="outline" className="min-w-[100px]">
          Cancel
        </Button>
        <Button className="min-w-[100px] bg-slate-900 text-white hover:bg-slate-800">
          Save
        </Button>
      </div>
    </div>
  );
}
