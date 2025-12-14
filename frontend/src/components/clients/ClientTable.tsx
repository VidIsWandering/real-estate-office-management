"use client"

import { Badge } from "@/components/ui/badge"

export const clients = [
    {
        id: "1",
        first: "John",
        last: "Wilson",
        email: "john.wilson@email.com",
        type: "Buyer",
        status: "Active"
    },
    {
        id: "2",
        first: "Sarah",
        last: "Martinez",
        email: "sarah.martinez@email.com",
        type: "Seller",
        status: "Active"
    },
    {
        id: "3",
        first: "Michael",
        last: "Chen",
        email: "michael.chen@email.com",
        type: "Investor",
        status: "Active"
    },
    {
        id: "4",
        first: "Lisa",
        last: "Anderson",
        email: "lisa.anderson@email.com",
        type: "Buyer",
        status: "Lead"
    },
    {
        id: "5",
        first: "David",
        last: "Thompson",
        email: "david.thompson@email.com",
        type: "Renter",
        status: "Active"
    },
    {
        id: "6",
        first: "Emma",
        last: "Johnson",
        email: "emma.johnson@email.com",
        type: "Seller",
        status: "Inactive"
    }
]

export function ClientTable() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-4">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-[180px_250px_120px_120px_1fr] px-4 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
                <span>NAME</span>
                <span>CONTACT</span>
                <span>TYPE</span>
                <span>STATUS</span>
                <span className="text-right">LAST CONTACT</span>
            </div>

            {/* ROWS */}
            {clients.map((c, idx) => {
                const [local, domain] = c.email.split("@")

                return (
                    <div
                        key={idx}
                        className="grid grid-cols-[180px_250px_120px_120px_1fr] px-4 py-5 border-b last:border-none hover:bg-gray-50 transition"
                    >
                        {/* NAME */}
                        <div>
                            <div className="text-gray-900 font-medium leading-tight">{c.first}</div>
                            <div className="text-gray-900 font-medium leading-tight">{c.last}</div>
                            <div className="text-xs text-gray-500 mt-1">ID: {1000 + idx}</div>
                        </div>

                        {/* EMAIL – split to 2 lines like Figma */}
                        <div className="text-gray-700 text-sm leading-tight">
                            {local}@<br />{domain}
                        </div>

                        {/* TYPE – exact color mapping */}
                        <div
                            className="text-sm font-semibold"
                            style={{
                                color:
                                    c.type === "Buyer"
                                        ? "#1A73E8"
                                        : c.type === "Seller"
                                            ? "#A855F7"
                                            : c.type === "Investor"
                                                ? "#F97316"
                                                : "#10B981"
                            }}
                        >
                            {c.type}
                        </div>

                        {/* STATUS */}
                        <div>
                            <Badge
                                variant={
                                    c.status === "Active"
                                        ? "success"
                                        : c.status === "Lead"
                                            ? "info"
                                            : "inactive"
                                }
                            >
                                {c.status}
                            </Badge>
                        </div>

                        {/* LAST CONTACT */}
                        <div className="text-right text-gray-300">/ /</div>
                    </div>
                )
            })}
        </div>
    )
}
