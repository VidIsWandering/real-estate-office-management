"use client";

import { useState } from "react";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import { PaymentsFilter } from "@/components/payments/PaymentsFilter";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentsStats } from "@/components/payments/PaymentsStats";
import { PaymentForm } from "@/components/payments/PaymentForm";
import {
  Payment,
  PaymentDraft,
  deriveStatusColor,
} from "@/components/payments/payment.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialPayments: Payment[] = [
  {
    id: "PT001",
    contractId: "HD001",
    voucherType: "Receipt",
    paymentDate: "15/12/2024",
    amount: "200,000,000",
    paymentMethod: "Bank transfer",
    payer: "Nguyễn Văn A",
    content: "Contract deposit payment",
    createdBy: "NV001",
    status: "Confirmed",
    statusColor: "green",
    hasDocument: true,
  },
  {
    id: "PC001",
    contractId: "HD001",
    voucherType: "Payment",
    paymentDate: "16/12/2024",
    amount: "17,000,000",
    paymentMethod: "Cash",
    payer: "Công ty ABC",
    content: "Brokerage commission payout",
    createdBy: "NV002",
    status: "Confirmed",
    statusColor: "green",
    hasDocument: true,
  },
  {
    id: "PT002",
    contractId: "HD002",
    voucherType: "Receipt",
    paymentDate: "20/11/2024",
    amount: "100,000,000",
    paymentMethod: "Bank transfer",
    payer: "Trần Thị B",
    content: "Deposit payment",
    createdBy: "NV001",
    status: "Confirmed",
    statusColor: "green",
    hasDocument: true,
  },
  {
    id: "PT003",
    contractId: "HD003",
    voucherType: "Receipt",
    paymentDate: "01/12/2024",
    amount: "50,000,000",
    paymentMethod: "Bank transfer",
    payer: "Lê Văn C",
    content: "December rent payment",
    createdBy: "NV003",
    status: "Created",
    statusColor: "gray",
    hasDocument: false,
  },
  {
    id: "PC002",
    contractId: "HD002",
    voucherType: "Payment",
    paymentDate: "22/11/2024",
    amount: "4,800,000",
    paymentMethod: "Cash",
    payer: "Nhân viên kinh doanh",
    content: "Commission payout",
    createdBy: "NV002",
    status: "Confirmed",
    statusColor: "green",
    hasDocument: true,
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const handleEdit = (payment: Payment) => {
    setEditing(payment);
    setShowEditForm(true);
  };

  const handleDelete = (payment: Payment) => {
    const ok = window.confirm(
      `Delete voucher ${payment.id}? This action cannot be undone.`
    );
    if (!ok) return;

    setPayments((prev) => prev.filter((p) => p.id !== payment.id));

    if (editing?.id === payment.id) {
      setShowEditForm(false);
      setEditing(null);
    }
  };

  const handleUpdate = (data: PaymentDraft) => {
    if (!editing) return;
    setPayments((prev) =>
      prev.map((p) =>
        p.id === editing.id
          ? {
              ...p,
              ...data,
              statusColor: deriveStatusColor(data.status),
            }
          : p
      )
    );
    setShowEditForm(false);
    setEditing(null);
  };

  return (
    <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
      <PaymentsHeader />

      <PaymentsFilter onCreate={() => setShowCreateForm(true)} />

      <div className="flex gap-6">
        <div className="flex-1">
          <PaymentsTable
            payments={payments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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

      <Dialog
        open={showEditForm}
        onOpenChange={(open) => {
          setShowEditForm(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit voucher</DialogTitle>
          </DialogHeader>

          {editing && (
            <PaymentForm
              voucherId={editing.id}
              initialData={editing}
              onSubmit={handleUpdate}
              onCancel={() => setShowEditForm(false)}
              submitLabel="Save changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
