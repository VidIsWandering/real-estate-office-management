import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Phone } from "lucide-react"

export function ClientStatsCard() {
    return (
        <Card className="w-full px-4 py-6 border-gray-200 rounded-xl">

            <CardHeader className="px-0">
                <CardTitle className="text-lg font-semibold">Client Statistics</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-0">

                {/* TOTAL CLIENTS */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Clients</p>
                        <p className="text-2xl font-bold">124</p>
                    </div>
                    <Users className="w-7 h-7 text-blue-500" />
                </div>

                {/* ACTIVE CLIENTS */}
                <div>
                    <p className="text-sm text-gray-500">Active Clients</p>
                    <div className="flex items-end gap-2">
                        <p className="text-lg font-semibold">48%</p>
                        <span className="text-xs text-gray-400">% of total</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                        <div className="h-2 bg-green-500 rounded-full w-[48%]" />
                    </div>
                </div>

                {/* FOLLOW UPS */}
                <div className="">
                    <p className="text-sm text-gray-500">Follow-ups Due</p>
                    <p className="text-xs text-orange-500 font-medium mt-1">Action needed</p>
                    <Phone className="mt-2 w-6 h-6 text-yellow-500" />
                </div>

                {/* CLIENT TYPES */}
                <div>
                    <p className="text-sm text-gray-500 mb-3">Client Types</p>

                    {[
                        { name: "Buyers", value: 45, color: "bg-blue-500" },
                        { name: "Sellers", value: 25, color: "bg-purple-500" },
                        { name: "Investors", value: 15, color: "bg-orange-500" },
                        { name: "Renters", value: 15, color: "bg-green-600" },
                    ].map((t) => (
                        <div key={t.name} className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${t.color}`} />
                                <span className="text-sm">{t.name}</span>
                            </div>
                            <span className="text-sm font-medium">{t.value}%</span>
                        </div>
                    ))}

                </div>

            </CardContent>
        </Card>
    )
}
