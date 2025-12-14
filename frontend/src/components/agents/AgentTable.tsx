
// filepath: d:\Code\ooad\project\frontend\src\components\agents\AgentTable.tsx
"use client";

import { Eye, Edit2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Agent } from "@/components/agents/AgentCard";

interface AgentTableProps {
  agents: Agent[];
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

function getStatusDot(status: Agent["status"]) {
  const colors = {
    Active: "bg-green-500",
    Inactive: "bg-gray-400",
  };
  return colors[status];
}

export function AgentTable({ agents }: AgentTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Active Properties
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {agent.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${getRoleColor(
                      agent.role,
                    )}`}
                  >
                    {agent.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {agent.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {agent.phone}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {agent.activeListings}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusDot(
                        agent.status,
                      )}`}
                    ></div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
                        agent.status,
                      )}`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => router.push(`/agents/${agent.id}`)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="More"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}