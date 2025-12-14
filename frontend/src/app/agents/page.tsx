"use client";

import { useRouter } from "next/navigation";
import { Agent } from "@/components/agents/AgentCard";
import { AgentCard } from "@/components/agents/AgentCard";

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

export default function AgentsPage() {
  const router = useRouter();

  const handleViewDetail = (id: string) => {
    router.push(`/agents/${id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Agents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockAgents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleViewDetail(agent.id)}
            className="text-left"
          >
            <AgentCard agent={agent} />
          </button>
        ))}
      </div>
    </div>
  );
}