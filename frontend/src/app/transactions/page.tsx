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

export default function TransactionsPage() {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="flex-1 space-y-4 md:space-y-6 min-w-0">

            <TransactionsHeader />

            <TransactionsFilter onCreate={() => setShowCreateForm(true)} />

            <div className="flex gap-6">
                <div className="flex-1">
                    <TransactionsTable />
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
                    <TransactionForm />
                </DialogContent>
            </Dialog>

        </div>
    );
}
