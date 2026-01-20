"use client";

import { useEffect, useState } from "react";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import {
  PaymentsFilter,
  PaymentsFilterValues,
} from "@/components/payments/PaymentsFilter";
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

// API thật
import {
  getPaymentsList,
  createPayment,
  updatePayment,
  confirmPayment,
  PaymentItem,
  VoucherType,
  VoucherStatus,
  PaymentMethod,
} from "@/lib/api/payment";

function toISODate(date: string): string {
  // Accepts dd/mm/yyyy and returns yyyy-mm-dd
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(date);
  if (!m) return "";
  const day = m[1].padStart(2, "0");
  const month = m[2].padStart(2, "0");
  const year = m[3];
  return `${year}-${month}-${day}`;
}

function fromISODate(date: string): string {
  // Accepts yyyy-mm-dd and returns dd/mm/yyyy
  const m = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(date);
  if (!m) return "";
  const year = m[1];
  const month = m[2];
  const day = m[3];
  return `${day}/${month}/${year}`;
}

function convertPaymentItemToPayment(item: PaymentItem): Payment {
  return {
    id: String(item.id),
    contractId: item.contract_id ? String(item.contract_id) : "",
    voucherType: item.type === "receipt" ? "Receipt" : "Payment",
    paymentDate: fromISODate(item.payment_time),
    amount: String(item.amount),
    paymentMethod: item.payment_method === "cash" ? "Cash" : "Bank transfer",
    payer: item.party,
    content: item.payment_description || "",
    createdBy: String(item.staff_id),
    status: item.status === "created" ? "Created" : "Confirmed",
    statusColor: deriveStatusColor(
      item.status === "created" ? "Created" : "Confirmed",
    ),
    hasDocument: false, // API does not have this field
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const [filters, setFilters] = useState<PaymentsFilterValues>({
    search: "",
    voucherType: "all",
    paymentMethod: "all",
    status: "all",
  });

  /* =====================
   * LOAD DATA
   * ===================== */
  const loadPayments = async () => {
    try {
      setLoading(true);
      const params: {
        page: number;
        limit: number;
        type?: VoucherType;
        payment_method?: PaymentMethod;
        status?: VoucherStatus;
      } = { page: 1, limit: 50 };

      if (filters.voucherType !== "all") {
        params.type = filters.voucherType as VoucherType;
      }
      if (filters.paymentMethod !== "all") {
        params.payment_method = filters.paymentMethod as PaymentMethod;
      }
      if (filters.status !== "all") {
        params.status = filters.status as VoucherStatus;
      }

      const res = await getPaymentsList(params);
      let items = res.data.map(convertPaymentItemToPayment);

      // Client-side search filter
      if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(
          (p: Payment) =>
            p.id.includes(searchLower) ||
            p.contractId.includes(searchLower) ||
            p.payer.toLowerCase().includes(searchLower),
        );
      }

      setPayments(items);
    } catch (err) {
      console.error("Load payments failed", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [filters]);

  /* =====================
   * HANDLERS
   * ===================== */
  const handleEdit = (payment: Payment) => {
    setEditing(payment);
    setShowEditForm(true);
  };

  const handleDelete = () => {
    alert("Backend does not support deleting vouchers.");
  };

  const handleCreate = async (data: PaymentDraft) => {
    // Validation
    const contractIdNum = parseInt(data.contractId);
    if (isNaN(contractIdNum)) {
      alert("Invalid contract ID");
      return;
    }
    const staffIdNum = parseInt(data.createdBy);
    if (isNaN(staffIdNum)) {
      alert("Invalid staff ID");
      return;
    }
    const amountNum = parseFloat(data.amount.replace(/,/g, ""));
    if (isNaN(amountNum)) {
      alert("Invalid amount");
      return;
    }

    try {
      const form = new FormData();
      form.append("contract_id", String(contractIdNum));
      form.append(
        "type",
        data.voucherType === "Receipt" ? "receipt" : "payment",
      );
      form.append("party", data.payer);
      form.append("payment_time", toISODate(data.paymentDate));
      form.append("amount", String(amountNum));
      form.append(
        "payment_method",
        data.paymentMethod === "Cash" ? "cash" : "bank_transfer",
      );
      form.append("payment_description", data.content);
      form.append("staff_id", String(staffIdNum));
      form.append(
        "status",
        data.status === "Created" ? "created" : "confirmed",
      );

      await createPayment(form);
      await loadPayments();
      setShowCreateForm(false);
    } catch (err) {
      console.error("Create payment failed", err);
      alert("Create failed");
    }
  };

  const handleUpdate = async (data: PaymentDraft) => {
    if (!editing) return;

    // Validation
    const contractIdNum = parseInt(data.contractId);
    if (isNaN(contractIdNum)) {
      alert("Invalid contract ID");
      return;
    }
    const staffIdNum = parseInt(data.createdBy);
    if (isNaN(staffIdNum)) {
      alert("Invalid staff ID");
      return;
    }
    const amountNum = parseFloat(data.amount.replace(/,/g, ""));
    if (isNaN(amountNum)) {
      alert("Invalid amount");
      return;
    }

    try {
      const form = new FormData();
      form.append("contract_id", String(contractIdNum));
      form.append(
        "type",
        data.voucherType === "Receipt" ? "receipt" : "payment",
      );
      form.append("party", data.payer);
      form.append("payment_time", toISODate(data.paymentDate));
      form.append("amount", String(amountNum));
      form.append(
        "payment_method",
        data.paymentMethod === "Cash" ? "cash" : "bank_transfer",
      );
      form.append("payment_description", data.content);
      form.append("staff_id", String(staffIdNum));
      form.append(
        "status",
        data.status === "Created" ? "created" : "confirmed",
      );

      await updatePayment(parseInt(editing.id), form);
      await loadPayments();
      setShowEditForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Update payment failed", err);
      alert("Update failed");
    }
  };

  /* =====================
   * RENDER
   * ===================== */
  return (
    <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
      <PaymentsHeader />

      <PaymentsFilter
        onCreate={() => setShowCreateForm(true)}
        filters={filters}
        onFilterChange={setFilters}
      />

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

      {/* CREATE */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="w-[95vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Receipt/Payment Voucher</DialogTitle>
          </DialogHeader>

          <PaymentForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* EDIT */}
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
