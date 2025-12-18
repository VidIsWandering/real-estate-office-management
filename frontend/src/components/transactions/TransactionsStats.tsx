import { Badge } from "@/components/ui/badge"

export function TransactionsStats() {
  return (
    <div className="space-y-4">

      {/* Total Revenue Box */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-1">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <div className="flex items-end gap-1">
          <h2 className="text-2xl font-bold">$1.4M</h2>
          <Badge className="bg-blue-100 text-blue-700 text-xs">↑ 12% last month</Badge>
        </div>
      </div>

      {/* This Month */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">This Month</p>
        <p className="text-xl font-semibold">22 Transactions</p>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Pending</p>
        <Badge className="bg-yellow-100 text-yellow-700">Awaiting completion</Badge>
      </div>

      {/* Types breakdown */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">Transaction Types</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Sales 65%
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Rentals 20%
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Leases 15%
        </div>
      </div>

    </div>
  )
}
