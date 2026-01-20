import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientItem } from "./types";

interface ClientTableProps {
  clients: ClientItem[];
  onSelectClient: (id: string) => void;
  selectedClientId: string | null;
  onDeleteClient: (id: string) => void;
  onStaffNameClick?: (staffName: string) => void;
}

export function ClientTable({
  clients,
  onSelectClient,
  selectedClientId,
  onDeleteClient,
  onStaffNameClick,
}: ClientTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    return type === "owner" ? "Owner" : "Customer";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Client Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Client Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Address
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Client Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Assigned Staff
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={cn(
                "border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer",
                selectedClientId === client.id && "bg-blue-100",
                index % 2 === 0 ? "bg-white" : "bg-gray-50",
              )}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {client.code}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">{client.name}</td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {client.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {client.phone}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {client.address}
              </td>
              <td className="px-4 py-4 text-sm">
                <Badge className={`${getTypeColor(client.clientType)}`}>
                  {getTypeLabel(client.clientType)}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStaffNameClick?.(client.assignedStaff);
                  }}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer font-medium"
                >
                  {client.assignedStaff}
                </button>
              </td>
              <td className="px-4 py-4 text-sm">
                <Badge className={`${getStatusColor(client.status)}`}>
                  {client.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClient(client.id);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Edit client"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${client.name}?`,
                        )
                      ) {
                        onDeleteClient(client.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
