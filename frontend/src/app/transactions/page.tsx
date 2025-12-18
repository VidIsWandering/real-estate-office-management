"use client";

import { useState } from "react";
import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";
import { TransactionsFilter } from "@/components/transactions/TransactionsFilter";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { SellDemandForm } from "@/components/transactions/SellDemandForm";
import { TransactionsInfoForm } from "@/components/transactions/TransactionsInfoForm";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  return (
    <div className="flex-1 space-y-6 min-w-0">
      <TransactionsHeader />

      {!selectedTransactionId && (
        <TransactionsFilter onCreate={() => setShowCreateForm(true)} />
      )}

      {showCreateForm && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Transaction</h2>
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
              onClick={() => setShowCreateForm(false)}
            >
              Close
            </Button>
          </div>
          <SellDemandForm />
        </div>
      )}

      {!showCreateForm && !selectedTransactionId && (
        <div className="flex gap-6">
          <div className="flex-1">
            <TransactionsTable
              onSelect={(id) => {
                setSelectedTransactionId(id);
                setShowCreateForm(false);
              }}
            />
          </div>
          <div className="w-80">
            <TransactionsStats />
          </div>
        </div>
      )}

      {selectedTransactionId && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Transaction Info – {selectedTransactionId}
            </h2>
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
              onClick={() => setSelectedTransactionId(null)}
            >
              Back
            </Button>
          </div>

          <TransactionsInfoForm transactionId={selectedTransactionId} />
        </div>
      )}
    </div>
  );
}
