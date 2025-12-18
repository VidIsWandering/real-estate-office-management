"use client";

import { useState } from "react";
import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";
import { TransactionsFilter } from "@/components/transactions/TransactionsFilter";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { SellDemandForm } from "@/components/transactions/SellDemandForm";
import {Button} from "@/components/ui/button";

export default function TransactionsPage() {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="flex-1 space-y-4 md:space-y-6 min-w-0">

            <TransactionsHeader />

            <TransactionsFilter onCreate={() => setShowCreateForm(true)} />

            {showCreateForm ? (
                <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">

                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Create New Transaction</h2>
                        <Button
                            variant="ghost"
                            className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setShowCreateForm(false)}
                        >
                            Close
                        </Button>

                    </div>

                    <SellDemandForm />
                </div>
            ) : (
                <>
                    <div className="flex gap-6">

                        <div className="flex-1">
                            <TransactionsTable />
                        </div>

                        <div className="w-80">
                            <TransactionsStats />
                        </div>

                    </div>
                </>
            )}

        </div>
    );
}
