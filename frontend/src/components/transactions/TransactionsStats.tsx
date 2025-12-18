import { Badge } from "@/components/ui/badge"

export function TransactionsStats() {
  return (
    <div className="space-y-4">

      {/* Total Transactions */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-1">
        <p className="text-sm text-gray-500">Total transactions</p>
        <div className="flex items-end gap-1">
          <h2 className="text-2xl font-bold">38</h2>
          <Badge className="bg-blue-100 text-blue-700 text-xs">↑ 12% this month</Badge>
        </div>
      </div>

      {/* Completed This Month */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Closed (this month)</p>
        <p className="text-xl font-semibold text-green-600">15</p>
      </div>

      {/* Processing */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Negotiating</p>
        <Badge className="bg-blue-100 text-blue-700">12 transactions</Badge>
      </div>

      {/* Waiting for Deposit */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Awaiting contract signing</p>
        <Badge className="bg-yellow-100 text-yellow-700">8 transactions</Badge>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">Total value</p>
        
        <div className="text-2xl font-bold text-primary">
          124 tỷ
        </div>

        <div className="text-xs text-gray-500">
          Commission: 2.8B VND
        </div>
      </div>

    </div>
  )
}
