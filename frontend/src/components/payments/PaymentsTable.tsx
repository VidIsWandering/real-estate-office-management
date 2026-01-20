"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment, statusColor } from "@/components/payments/payment.types";

interface PaymentsTableProps {
  payments: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
}: PaymentsTableProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Payment | null>(null);

  const openDetails = (p: Payment) => {
    setSelected(p);
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !selected) return;

    const fresh = payments.find((p) => p.id === selected.id);
    if (!fresh) {
      setOpen(false);
      setSelected(null);
      return;
    }

    setSelected(fresh);
  }, [open, payments, selected]);

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Voucher ID</TableHead>
            <TableHead>Contract ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => (
            <TableRow
              key={payment.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => openDetails(payment)}
            >
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.contractId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {payment.voucherType === "Receipt" ? (
                    <ArrowDownCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={
                      payment.voucherType === "Receipt"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {payment.voucherType}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{payment.amount}</TableCell>
              <TableCell>
                <Badge className={statusColor[payment.statusColor]}>
                  {payment.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(payment);
                    }}
                    aria-label="View details"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(payment);
                    }}
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(payment);
                    }}
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voucher details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Voucher ID</div>
                <div className="font-medium">{selected.id}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <Badge className={statusColor[selected.statusColor]}>
                  {selected.status}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-gray-500">Contract ID</div>
                <div className="font-medium">{selected.contractId}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="flex items-center gap-2">
                  {selected.voucherType === "Receipt" ? (
                    <ArrowDownCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div
                    className={
                      selected.voucherType === "Receipt"
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {selected.voucherType}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Payment date</div>
                <div className="font-medium">{selected.paymentDate}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Amount</div>
                <div className="font-medium">{selected.amount}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Method</div>
                <div className="font-medium">{selected.paymentMethod}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Payer/Payee</div>
                <div className="font-medium">{selected.payer}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-500">Description</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.content}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Created by</div>
                <div className="font-medium">{selected.createdBy}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Document</div>
                {selected.hasDocument ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="text-sm text-gray-700">Attached</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">None</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
