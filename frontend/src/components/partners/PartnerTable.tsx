import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Partner } from "@/app/partners/page";

interface PartnerTableProps {
  partners: Partner[];
  onSelectPartner: (id: string) => void;
  selectedPartnerId: string | null;
  onDeletePartner: (id: string) => void;
  onStaffNameClick?: (staffName: string) => void;
}

export function PartnerTable({
  partners,
  onSelectPartner,
  selectedPartnerId,
  onDeletePartner,
  onStaffNameClick,
}: PartnerTableProps) {
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
              Partner Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Partner Name
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
              Partner Type
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
          {partners.map((partner, index) => (
            <tr
              key={partner.id}
              onClick={() => onSelectPartner(partner.id)}
              className={cn(
                "border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer",
                selectedPartnerId === partner.id && "bg-blue-100",
                index % 2 === 0 ? "bg-white" : "bg-gray-50",
              )}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {partner.code}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {partner.name}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {partner.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {partner.phone}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {partner.address}
              </td>
              <td className="px-4 py-4 text-sm">
                <Badge className={`${getTypeColor(partner.partnerType)}`}>
                  {getTypeLabel(partner.partnerType)}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStaffNameClick?.(partner.assignedStaff);
                  }}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer font-medium"
                >
                  {partner.assignedStaff}
                </button>
              </td>
              <td className="px-4 py-4 text-sm">
                <Badge className={`${getStatusColor(partner.status)}`}>
                  {partner.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPartner(partner.id);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Edit partner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${partner.name}?`,
                        )
                      ) {
                        onDeletePartner(partner.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete partner"
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
