export const statusColor = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
} as const;

export type StatusColor = keyof typeof statusColor;

export type PaymentStatus = "Created" | "Confirmed";
export type VoucherType = "Receipt" | "Payment";
export type PaymentMethod = "Cash" | "Bank transfer";

export interface Payment {
  id: string;
  contractId: string;
  voucherType: VoucherType;
  paymentDate: string; // dd/mm/yyyy
  amount: string;
  paymentMethod: PaymentMethod;
  payer: string;
  content: string;
  createdBy: string;
  status: PaymentStatus;
  statusColor: StatusColor;
  hasDocument: boolean;
}

export type PaymentDraft = Omit<Payment, "id" | "statusColor">;

export function deriveStatusColor(status: PaymentStatus): StatusColor {
  return status === "Confirmed" ? "green" : "gray";
}
