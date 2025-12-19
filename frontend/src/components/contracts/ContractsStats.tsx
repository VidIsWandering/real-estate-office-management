import { Badge } from "@/components/ui/badge";

export function ContractsStats() {
  return (
    <div className="space-y-4">
      {/* Total Contracts */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-1">
        <p className="text-sm text-gray-500">Total contracts</p>
        <div className="flex items-end gap-1">
          <h2 className="text-2xl font-bold">42</h2>
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            ↑ 15% this month
          </Badge>
        </div>
      </div>

      {/* Signed & Notarized */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Notarized</p>
        <p className="text-xl font-semibold text-green-600">28</p>
      </div>

      {/* Pending Signature */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Awaiting signature</p>
        <Badge className="bg-yellow-100 text-yellow-700">8 contracts</Badge>
      </div>

      {/* Draft */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Draft</p>
        <p className="text-xl font-semibold text-gray-600">6</p>
      </div>

      {/* Contract Types */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">Contract types</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Sale &
          purchase 60%
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Deposit
          25%
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Lease 15%
        </div>
      </div>
    </div>
  );
}
