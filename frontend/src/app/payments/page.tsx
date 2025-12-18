"use client";

import { useState } from "react";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import { PaymentsFilter } from "@/components/payments/PaymentsFilter";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentsStats } from "@/components/payments/PaymentsStats";
import { PaymentForm } from "@/components/payments/PaymentForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function PaymentsPage() {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
            <PaymentsHeader />

            <PaymentsFilter onCreate={() => setShowCreateForm(true)} />

            <div className="flex gap-6">
                <div className="flex-1">
                    <PaymentsTable />
                </div>

                <div className="w-80">
                    <PaymentsStats />
                </div>
            </div>

            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent className="w-[95vw] max-w-none max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New Receipt/Payment Voucher</DialogTitle>
                    </DialogHeader>
                    <PaymentForm />
                </DialogContent>
            </Dialog>
        </div>
    );
}
