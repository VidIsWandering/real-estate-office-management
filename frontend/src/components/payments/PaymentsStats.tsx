import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export function PaymentsStats() {
  return (
    <div className="space-y-4">

      {/* Total Receipts (Thu) */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-1">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <ArrowDownCircle className="h-4 w-4 text-green-600" />
          Total receipts
        </p>
        <div className="flex items-end gap-1">
          <h2 className="text-2xl font-bold text-green-600">850M VND</h2>
          <Badge className="bg-green-100 text-green-700 text-xs">↑ 18% this month</Badge>
        </div>
      </div>

      {/* Total Payments (Chi) */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-1">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <ArrowUpCircle className="h-4 w-4 text-red-600" />
          Total payments
        </p>
        <div className="flex items-end gap-1">
          <h2 className="text-2xl font-bold text-red-600">242M VND</h2>
          <Badge className="bg-red-100 text-red-700 text-xs">↑ 12% this month</Badge>
        </div>
      </div>

      {/* Net Balance */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Net balance</p>
        <p className="text-xl font-semibold text-blue-600">+608M VND</p>
      </div>

      {/* Confirmed Vouchers */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Confirmed</p>
        <p className="text-xl font-semibold text-green-600">42 vouchers</p>
      </div>

      {/* Pending Confirmation */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Pending confirmation</p>
        <Badge className="bg-yellow-100 text-yellow-700">8 vouchers</Badge>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">Payment methods</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Bank transfer 75%
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Cash 25%
        </div>
      </div>

    </div>
  )
}
