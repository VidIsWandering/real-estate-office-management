"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  PaymentDraft,
  PaymentMethod,
  PaymentStatus,
  VoucherType,
} from "@/components/payments/payment.types";

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

export function PaymentForm({
  voucherId,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  voucherId?: string;
  initialData?: Partial<PaymentDraft>;
  onSubmit?: (data: PaymentDraft) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [contractId, setContractId] = useState(initialData?.contractId ?? "");
  const [voucherType, setVoucherType] = useState<VoucherType | "">(
    initialData?.voucherType ?? ""
  );
  const [paymentDateISO, setPaymentDateISO] = useState(
    initialData?.paymentDate ? toISODate(initialData.paymentDate) : ""
  );
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(
    initialData?.paymentMethod ?? ""
  );
  const [payer, setPayer] = useState(initialData?.payer ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [createdBy, setCreatedBy] = useState(initialData?.createdBy ?? "");
  const [status, setStatus] = useState<PaymentStatus | "">(
    initialData?.status ?? ""
  );
  const [hasDocument, setHasDocument] = useState(
    initialData?.hasDocument ?? false
  );

  useEffect(() => {
    if (!initialData) return;
    setContractId(initialData.contractId ?? "");
    setVoucherType(initialData.voucherType ?? "");
    setPaymentDateISO(initialData.paymentDate ? toISODate(initialData.paymentDate) : "");
    setAmount(initialData.amount ?? "");
    setPaymentMethod(initialData.paymentMethod ?? "");
    setPayer(initialData.payer ?? "");
    setContent(initialData.content ?? "");
    setCreatedBy(initialData.createdBy ?? "");
    setStatus(initialData.status ?? "");
    setHasDocument(initialData.hasDocument ?? false);
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    onSubmit({
      contractId,
      voucherType: (voucherType || "Receipt") as VoucherType,
      paymentDate: fromISODate(paymentDateISO),
      amount,
      paymentMethod: (paymentMethod || "Cash") as PaymentMethod,
      payer,
      content,
      createdBy,
      status: (status || "Created") as PaymentStatus,
      hasDocument,
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Payment Voucher Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Voucher details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Voucher ID</label>
            <Input
              disabled
              placeholder="Auto-generated"
              value={voucherId ?? ""}
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Related contract</label>
            <Select value={contractId} onValueChange={setContractId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contract..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HD001">
                  HD001 - Sale & purchase - Nguyễn Văn A
                </SelectItem>
                <SelectItem value="HD002">
                  HD002 - Deposit agreement - Trần Thị B
                </SelectItem>
                <SelectItem value="HD003">
                  HD003 - Lease agreement - Lê Văn C
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-gray-600 mb-2 block">
              Voucher type
            </label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receipt"
                  checked={voucherType === "Receipt"}
                  onCheckedChange={(checked) =>
                    checked && setVoucherType("Receipt")
                  }
                />
                <Label htmlFor="receipt" className="text-sm font-normal">
                  Receipt
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payment"
                  checked={voucherType === "Payment"}
                  onCheckedChange={(checked) =>
                    checked && setVoucherType("Payment")
                  }
                />
                <Label htmlFor="payment" className="text-sm font-normal">
                  Payment
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Payment details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Payment date</label>
            <Input
              type="date"
              value={paymentDateISO}
              onChange={(e) => setPaymentDateISO(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <Input
              placeholder="e.g., 100,000,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Payer/Payee</label>
            <Input
              placeholder="Enter payer/payee name"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-gray-600 mb-2 block">
              Payment method
            </label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cash"
                  checked={paymentMethod === "Cash"}
                  onCheckedChange={(checked) =>
                    checked && setPaymentMethod("Cash")
                  }
                />
                <Label htmlFor="cash" className="text-sm font-normal">
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transfer"
                  checked={paymentMethod === "Bank transfer"}
                  onCheckedChange={(checked) =>
                    checked && setPaymentMethod("Bank transfer")
                  }
                />
                <Label htmlFor="transfer" className="text-sm font-normal">
                  Bank transfer
                </Label>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-gray-600">Description</label>
            <Textarea
              rows={4}
              placeholder="Enter payment description..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">
              Supporting documents
            </label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setHasDocument(Boolean(e.target.files?.length))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Management Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Administration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Created by</label>
            <Select value={createdBy} onValueChange={setCreatedBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NV001">NV001 - Nguyễn Văn A</SelectItem>
                <SelectItem value="NV002">NV002 - Trần Thị B</SelectItem>
                <SelectItem value="NV003">NV003 - Lê Văn C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Status</label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-new"
                  checked={status === "Created"}
                  onCheckedChange={(checked) => checked && setStatus("Created")}
                />
                <Label htmlFor="status-new" className="text-sm font-normal">
                  Created
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-confirmed"
                  checked={status === "Confirmed"}
                  onCheckedChange={(checked) =>
                    checked && setStatus("Confirmed")
                  }
                />
                <Label
                  htmlFor="status-confirmed"
                  className="text-sm font-normal"
                >
                  Confirmed
                </Label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center gap-3">
            <Button type="submit" className="bg-primary text-white px-8">
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-8"
              onClick={() => onCancel?.()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
