"use client"

import { Search, ChevronDown, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ClientHeader() {
    return (
        <div className="mb-6">

            {/* TITLE */}
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            </div>

            <p className="text-gray-500 mt-1">
                Manage client relationships and track interactions.
            </p>

            {/* ACTIONS ROW */}
            <div className="flex justify-between items-center mt-6">

                <div className="flex items-center gap-3">

                    {/* SEARCH */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search clients by name or email..."
                            className="pl-12 w-96 h-11 bg-[#F8F9FB] border border-gray-200 rounded-xl"
                        />
                    </div>

                    {/* ALL TYPES */}
                    <button className="flex items-center gap-2 h-11 px-4 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-700">
                        All Types
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* ADD CLIENT */}
                <button className="flex items-center gap-2 bg-[#1A73E8] text-white px-5 h-11 rounded-xl text-sm font-medium shadow">
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <Plus className="w-4 h-4" />
                    </div>
                    Add Client
                </button>
            </div>
        </div>
    )
}
