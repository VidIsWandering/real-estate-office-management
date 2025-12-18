"use client";

import { ArrowRight, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  property: string;
  agent: string;
  amount: number;
  date: string;
  type: "Sale" | "Rental";
}

const transactions: Transaction[] = [
  {
    id: "1",
    property: "Luxury Downtown Penthouse",
    agent: "Alice Chen",
    amount: 950000,
    date: "2024-01-20",
    type: "Sale",
  },
  {
    id: "2",
    property: "Suburban Family Home",
    agent: "Bob Smith",
    amount: 425000,
    date: "2024-01-19",
    type: "Sale",
  },
  {
    id: "3",
    property: "Commercial Office Space",
    agent: "Carol Davis",
    amount: 1200000,
    date: "2024-01-18",
    type: "Sale",
  },
  {
    id: "4",
    property: "Beachfront Condo",
    agent: "David Lee",
    amount: 650000,
    date: "2024-01-17",
    type: "Rental",
  },
  {
    id: "5",
    property: "Modern Urban Townhouse",
    agent: "Frank Brown",
    amount: 580000,
    date: "2024-01-16",
    type: "Sale",
  },
];

export function RecentTransactions() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {transaction.property}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      transaction.type === "Sale"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{transaction.agent}</p>
                <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-sm font-bold text-gray-900">
                  ${transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Transactions →
        </button>
      </div>
    </div>
  );
}
