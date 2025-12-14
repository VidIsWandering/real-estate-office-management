import Link from "next/link";
import { Mail, Phone, Home, ArrowRight } from "lucide-react";

export interface Agent {
  id: string;
  name: "Senior Agent" | "Junior Agent" | "Sales Manager" | string;
  role: "Senior Agent" | "Junior Agent" | "Sales Manager";
  email: string;
  phone: string;
  activeListings: number;
  avatar: string;
  status: "Active" | "Inactive";
}

interface AgentCardProps {
  agent: Agent;
}

function getRoleColor(role: Agent["role"]) {
  const colors = {
    "Senior Agent": "bg-purple-50 text-purple-700",
    "Junior Agent": "bg-blue-50 text-blue-700",
    "Sales Manager": "bg-green-50 text-green-700",
  };
  return colors[role];
}

function getStatusColor(status: Agent["status"]) {
  const colors = {
    Active: "bg-green-50 text-green-700",
    Inactive: "bg-gray-50 text-gray-700",
  };
  return colors[status];
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {agent.avatar}
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
            agent.status,
          )}`}
        >
          {agent.status}
        </span>
      </div>

      {/* Agent Info */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{agent.name}</h3>
      <div className="mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${getRoleColor(
            agent.role,
          )}`}
        >
          {agent.role}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{agent.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{agent.phone}</span>
        </div>
      </div>

      {/* Active Listings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-600">Active Listings</span>
        </div>
        <span className="text-lg font-bold text-primary">
          {agent.activeListings}
        </span>
      </div>

      {/* Button */}
      <Link
        href={`/agents/${agent.id}`}
        className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        View Profile
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}