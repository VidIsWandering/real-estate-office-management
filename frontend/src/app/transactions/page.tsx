"use client";

import { useState } from "react";
import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";
import { TransactionsFilter } from "@/components/transactions/TransactionsFilter";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TransactionStatus } from "@/lib/api/transactions";

export default function TransactionsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "all">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
      <TransactionsHeader />

      <TransactionsFilter
        onCreate={() => setShowCreateForm(true)}
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <TransactionsTable
            search={search}
            status={status === "all" ? undefined : status}
            refreshKey={refreshKey}
          />
        </div>

        <div className="w-80">
          <TransactionsStats />
        </div>
      </div>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onCancel={() => setShowCreateForm(false)}
            onCreated={() => {
              setShowCreateForm(false);
              setRefreshKey((k) => k + 1);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
