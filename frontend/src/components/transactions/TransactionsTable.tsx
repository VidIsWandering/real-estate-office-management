"use client";

import { useState } from "react";
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
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusColor = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
} as const;

type StatusColor = keyof typeof statusColor;

interface Transaction {
  id: string;
  propertyCode: string;
  propertyLocation: string;
  customer: string;
  agent: string;
  finalPrice: string;
  preliminaryTerms: string;
  status: string;
  statusColor: StatusColor;
  cancellationReason?: string;
}

const transactions: Transaction[] = [
  {
    id: "GD001",
    propertyCode: "BDS001",
    propertyLocation: "Townhouse - District 1",
    customer: "Nguyễn Văn A",
    agent: "Phạm Văn D",
    finalPrice: "8.5B VND",
    preliminaryTerms: "30% upfront, 70% upon handover",
    status: "Awaiting Contract Signing",
    statusColor: "blue",
  },
  {
    id: "GD002",
    propertyCode: "BDS002",
    propertyLocation: "Apartment - District 7",
    customer: "Trần Thị B",
    agent: "Hoàng Thị E",
    finalPrice: "3.2B VND",
    preliminaryTerms: "100% payment upon signing",
    status: "Negotiating",
    statusColor: "yellow",
  },
  {
    id: "GD003",
    propertyCode: "BDS003",
    propertyLocation: "Villa - Thu Duc",
    customer: "Lê Văn C",
    agent: "Phạm Văn D",
    finalPrice: "15B VND",
    preliminaryTerms: "500M deposit, remaining split into 3 payments",
    status: "Negotiating",
    statusColor: "yellow",
  },
  {
    id: "GD004",
    propertyCode: "BDS004",
    propertyLocation: "Land plot - Binh Duong",
    customer: "Võ Thị F",
    agent: "Đặng Văn G",
    finalPrice: "1.8B VND",
    preliminaryTerms: "Immediate payment",
    status: "Cancelled",
    statusColor: "red",
    cancellationReason: "Customer did not qualify for bank financing",
  },
];

interface TransactionsTableProps {
  onSelect: (id: string) => void;
}

export function TransactionsTable() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const openDetails = (t: Transaction) => {
    setSelected(t);
    setOpen(true);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Final Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((t) => (
            <TableRow
              key={t.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => openDetails(t)}
            >
              <TableCell className="font-medium">{t.id}</TableCell>
              <TableCell>{t.customer}</TableCell>
              <TableCell>{t.agent}</TableCell>
              <TableCell className="font-semibold">{t.finalPrice}</TableCell>

              <TableCell>
                <Badge className={statusColor[t.statusColor]}>{t.status}</Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(t);
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
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={(e) => e.stopPropagation()}
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
            <DialogTitle>Transaction details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Transaction ID</div>
                <div className="font-medium">{selected.id}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <Badge className={statusColor[selected.statusColor]}>
                  {selected.status}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-gray-500">Property</div>
                <div className="font-medium">{selected.propertyCode}</div>
                <div className="text-sm text-gray-600">
                  {selected.propertyLocation}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Final price</div>
                <div className="font-medium">{selected.finalPrice}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Customer</div>
                <div className="font-medium">{selected.customer}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">agent</div>
                <div className="font-medium">{selected.agent}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-500">Preliminary terms</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.preliminaryTerms}
                </div>
              </div>

              {selected.status === "Cancelled" &&
                selected.cancellationReason && (
                  <div className="md:col-span-2">
                    <div className="text-xs text-gray-500">
                      Cancellation reason
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selected.cancellationReason}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
