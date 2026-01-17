import {
  Mail,
  Phone,
  Home,
  TrendingUp,
  MessageCircle,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Agent } from "@/components/agents/AgentCard";

interface AgentProfileDetailProps {
  agent: Agent;
  onClose?: () => void;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: string;
  averageDealSize: string;
  closureRate: string;
}

interface Transaction {
  id: string;
  property: string;
  type: "Sale" | "Rental";
  amount: string;
  date: string;
}

const mockSalesStats: Record<string, SalesStats> = {
  "1": {
    totalSales: 45,
    totalRevenue: "$8.5M",
    averageDealSize: "$189K",
    closureRate: "92%",
  },
  "2": {
    totalSales: 28,
    totalRevenue: "$4.2M",
    averageDealSize: "$150K",
    closureRate: "85%",
  },
  "3": {
    totalSales: 52,
    totalRevenue: "$9.8M",
    averageDealSize: "$188K",
    closureRate: "94%",
  },
  "4": {
    totalSales: 38,
    totalRevenue: "$6.1M",
    averageDealSize: "$160K",
    closureRate: "88%",
  },
  "5": {
    totalSales: 56,
    totalRevenue: "$10.2M",
    averageDealSize: "$182K",
    closureRate: "96%",
  },
  "6": {
    totalSales: 22,
    totalRevenue: "$3.3M",
    averageDealSize: "$150K",
    closureRate: "80%",
  },
};

const mockTransactions: Record<string, Transaction[]> = {
  "1": [
    {
      id: "T001",
      property: "Downtown Luxury Penthouse",
      type: "Sale",
      amount: "$950,000",
      date: "2024-01-15",
    },
    {
      id: "T002",
      property: "Suburban Family Home",
      type: "Sale",
      amount: "$450,000",
      date: "2024-01-10",
    },
    {
      id: "T003",
      property: "Modern Apartment",
      type: "Rental",
      amount: "$3,500/mo",
      date: "2024-01-08",
    },
  ],
  "2": [
    {
      id: "T004",
      property: "Beachfront Villa",
      type: "Sale",
      amount: "$1,200,000",
      date: "2024-01-14",
    },
    {
      id: "T005",
      property: "Urban Condo",
      type: "Rental",
      amount: "$2,800/mo",
      date: "2024-01-12",
    },
  ],
  "3": [
    {
      id: "T006",
      property: "Commercial Office",
      type: "Sale",
      amount: "$2,500,000",
      date: "2024-01-16",
    },
    {
      id: "T007",
      property: "Retail Space",
      type: "Sale",
      amount: "$1,100,000",
      date: "2024-01-13",
    },
  ],
};

export function AgentProfileDetail({
  agent,
  onClose,
}: AgentProfileDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState(agent);
  const stats = mockSalesStats[agent.id] || mockSalesStats["1"];
  const transactions = mockTransactions[agent.id] || [];

  const handleSave = () => {
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Senior Agent": "bg-purple-100 text-purple-800",
      "Junior Agent": "bg-blue-100 text-blue-800",
      "Sales Manager": "bg-green-100 text-green-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-primary">
              {agent.avatar}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedAgent.name}
                  onChange={(e) =>
                    setEditedAgent({ ...editedAgent, name: e.target.value })
                  }
                  className="text-2xl font-bold text-white bg-white bg-opacity-20 rounded px-2 py-1 mb-2 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white mb-2">
                  {agent.name}
                </h1>
              )}
              <div className="flex gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleColor(
                    agent.role,
                  )}`}
                >
                  {agent.role}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                    agent.status,
                  )}`}
                >
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedAgent.email}
                  onChange={(e) =>
                    setEditedAgent({ ...editedAgent, email: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-900">{agent.email}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editedAgent.phone}
                  onChange={(e) =>
                    setEditedAgent({ ...editedAgent, phone: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              ) : (
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-gray-900">{agent.phone}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sales Stats */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">Total Sales</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalSales}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  Total Revenue
                </p>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {stats.totalRevenue}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-700 font-medium">
                  Avg Deal Size
                </p>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {stats.averageDealSize}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-700 font-medium">
                  Closure Rate
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {stats.closureRate}
              </p>
            </div>
          </div>
        </section>

        {/* Active Listings */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Active Listings
              </h2>
            </div>
            <span className="text-3xl font-bold text-primary">
              {agent.activeListings}
            </span>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.property}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === "Sale"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {transaction.amount}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent transactions
              </p>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Send Message
          </button>
          <button className="flex-1 px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Viewing
          </button>
          <button className="px-4 py-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
