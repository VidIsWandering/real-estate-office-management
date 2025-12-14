"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Agent } from "@/components/agents/AgentCard";
import { AgentProfileDetail } from "@/components/agents/AgentProfileDetail";

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Alice Chen",
    role: "Senior Agent",
    email: "alice.chen@realestate.com",
    phone: "(555) 123-4567",
    activeListings: 28,
    avatar: "AC",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Junior Agent",
    email: "bob.smith@realestate.com",
    phone: "(555) 234-5678",
    activeListings: 22,
    avatar: "BS",
    status: "Active",
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "Sales Manager",
    email: "carol.davis@realestate.com",
    phone: "(555) 345-6789",
    activeListings: 25,
    avatar: "CD",
    status: "Active",
  },
  {
    id: "4",
    name: "David Lee",
    role: "Senior Agent",
    email: "david.lee@realestate.com",
    phone: "(555) 456-7890",
    activeListings: 19,
    avatar: "DL",
    status: "Active",
  },
  {
    id: "5",
    name: "Emma Wilson",
    role: "Senior Agent",
    email: "emma.wilson@realestate.com",
    phone: "(555) 567-8901",
    activeListings: 31,
    avatar: "EW",
    status: "Active",
  },
  {
    id: "6",
    name: "Frank Brown",
    role: "Junior Agent",
    email: "frank.brown@realestate.com",
    phone: "(555) 678-9012",
    activeListings: 20,
    avatar: "FB",
    status: "Inactive",
  },
];

interface AgentProfilePageProps {
  params: Promise<{
    agentId: string;
  }>;
}

export default function AgentProfile({ params }: AgentProfilePageProps) {
  const router = useRouter();
   const { agentId } = React.use(params);


  const agent = useMemo(
    () => mockAgents.find((a) => a.id === agentId) ?? null,
    [agentId],
  );

  const goBackToAgents = () => {
    router.push("/agents");
  };

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Agent Not Found
        </h1>
        <button
          onClick={goBackToAgents}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Agents
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={goBackToAgents}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Agent Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AgentProfileDetail agent={agent} />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Send Email
              </button>
              <button className="w-full px-4 py-2 border border-primary text-primary text-sm rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Call Agent
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50 transition-colors">
                View Properties
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Related Agents
            </h3>
            <div className="space-y-2">
              {mockAgents
                .filter((a) => a.id !== agentId && a.status === "Active")
                .slice(0, 3)
                .map((relatedAgent) => (
                  <button
                    key={relatedAgent.id}
                    onClick={() => router.push(`/agents/${relatedAgent.id}`)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                  >
                    <p className="font-medium text-gray-900">
                      {relatedAgent.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {relatedAgent.role}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}